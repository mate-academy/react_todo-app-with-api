import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [currentSelect, setCurrentSelect] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(-1);
  const [isEditingId, setIsEditingId] = useState(-1);
  const [isDeletingId, setIsDeletingId] = useState(-1);

  const titleRef = useRef<HTMLInputElement>(null);
  const editTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todos, errorMessage]);

  useEffect(() => {
    if (editTitleRef.current) {
      editTitleRef.current.focus();
    }
  }, [isEditingId]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const completeTodo = ({ id, ...todoData }: Todo) => {
    setErrorMessage('');
    setIsLoading(true);
    setIsUpdatingId(id);

    updateTodos({ id, ...todoData, completed: !todoData.completed })
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !todo.completed,
              };
            }

            return todo;
          }),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsUpdatingId(-1);
      });
  };

  const completeAllTodos = () => {
    setErrorMessage('');
    setIsLoading(true);

    const shouldComplete = !todos.every(todo => todo.completed);

    const completed = todos.filter(todo => todo.completed !== shouldComplete);

    const updatePromises = completed.map(todo =>
      updateTodos({ ...todo, completed: shouldComplete }),
    );

    Promise.all(updatePromises)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            return {
              ...todo,
              completed: shouldComplete,
            };
          }),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsLoading(true);
    setIsDeletingId(todoId);

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsDeletingId(-1);
      });
  };

  const clearCompleted = () => {
    setErrorMessage('');
    setIsLoading(true);

    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodos(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          return null;
        }),
    );

    Promise.all(deletePromises)
      .then(deletedIds => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !deletedIds.includes(todo.id)),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    setIsLoading(true);

    const temp = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(temp);

    addTodos(temp)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      titleRef.current?.focus();

      return;
    }

    addTodo({ userId: 3308, title: trimmedTitle, completed: false });
  };

  const editTodo = ({ id, ...todoData }: Todo) => {
    setErrorMessage('');
    setIsLoading(true);
    setIsEditingId(id);
    setIsUpdatingId(id);

    updateTodos({ id, ...todoData })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                title: todoData.title,
              };
            }

            return todo;
          }),
        );
        setIsEditingId(-1);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsUpdatingId(-1);
      });
  };

  const cancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      return setIsEditingId(-1);
    }
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundTodo = todos.find(t => t.id === isEditingId);

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === foundTodo?.title) {
      setIsEditingId(-1);

      return;
    }

    if (!foundTodo) {
      return;
    }

    if (!trimmedTitle) {
      deleteTodo(foundTodo.id);

      return;
    }

    editTodo({ ...foundTodo, title: trimmedTitle });
  };

  const handleBlur = () => {
    const foundTodo = todos.find(t => t.id === isEditingId);

    const trimmedTitle = editTitle.trim();

    if (!foundTodo) {
      return;
    }

    if (!trimmedTitle) {
      deleteTodo(foundTodo.id);

      return;
    }

    editTodo({ ...foundTodo, title: trimmedTitle });
  };

  const filteredTodos = todos.filter(todo => {
    if (currentSelect === 'Active') {
      return !todo.completed;
    }

    if (currentSelect === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={todoTitle}
          titleRef={titleRef}
          isLoading={isLoading}
          onSaveTitle={setTodoTitle}
          onSubmit={handleSubmit}
          onCompleteAllTodos={completeAllTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              title={editTitle}
              editTitleRef={editTitleRef}
              isUpdatingId={isUpdatingId}
              isEditingId={isEditingId}
              isDeletingId={isDeletingId}
              onDeleteTodo={deleteTodo}
              onCompleteTodo={completeTodo}
              onSaveTitle={setEditTitle}
              onSaveEditingId={setIsEditingId}
              onCancelEdit={cancelEdit}
              onHandleEdit={handleEdit}
              onHandleBlur={handleBlur}
            />
          ))}

          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              title={editTitle}
              editTitleRef={editTitleRef}
              isUpdatingId={isUpdatingId}
              isEditingId={isEditingId}
              isDeletingId={isDeletingId}
              onDeleteTodo={deleteTodo}
              onCompleteTodo={completeTodo}
              onSaveTitle={setEditTitle}
              onSaveEditingId={setIsEditingId}
              onCancelEdit={cancelEdit}
              onHandleEdit={handleEdit}
              onHandleBlur={handleBlur}
              isLoading={isLoading}
            />
          )}
        </section>

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            currentSelect={currentSelect}
            onSelectStatus={setCurrentSelect}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onSaveErrorMessage={setErrorMessage}
      />
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/Todolist/Todolist';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/Error/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [anyCompleted, setAnyCompleted] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [editedTodo, setEditedTodo] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [isToggleButtonHidden, setIsToggleButtonHidden] = useState(true);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsErrorHidden(false);

    setTimeout(() => {
      setIsErrorHidden(true);
    }, 3000);
  };

  useEffect(() => {
    setIsToggleButtonHidden(false);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        handleErrorMessage('Unable to load todos');
        throw error;
      });
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      setIsToggleButtonHidden(false);
    } else {
      setIsToggleButtonHidden(true);
    }
  }, [todos]);

  useEffect(() => {
    if (todos.every(todo => todo.completed)) {
      setIsAllCompleted(true);
    } else {
      setIsAllCompleted(false);
    }
  }, [todos]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAnyCompleted(todos.some(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  const addTodo = ({ title, completed, userId }: Todo) => {
    setIsDisabled(true);

    if (!title.trim()) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({ id: 0, title, completed, userId });

    todosService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => handleErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);
    setIsDisabled(true);
    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setIsDisabled(false);
      })
      .catch(() => handleErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
        setIsDisabled(false);
        inputRef.current?.focus();
      });
  };

  const onTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      handleErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    addTodo({
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
      userId: todosService.USER_ID,
    });
  };

  const filtredTodos = (filterQuery: string | null): Todo[] => {
    if (!filterQuery) {
      return todos;
    }

    if (filterQuery === 'completed') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => todo.completed);
    }

    if (filterQuery === 'active') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => !todo.completed);
    }

    return todos;
  };

  const renameCallback = () => {
    // Callback logic here
    // For example, updating a state or triggering another function
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  const handleEditTodo = (id: number | null) => {
    setEditedTodo(id);

    if (id !== null) {
      const todoToEdit = todos.find(t => t.id === id);

      if (todoToEdit) {
        setEditedTodoTitle(todoToEdit.title);
      }
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    setProcessingIds(currentIds => [...currentIds, updatedTodo.id]);

    return todosService
      .updateTodo(updatedTodo)
      .then(responseTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          if (index !== -1) {
            newTodos.splice(index, 1, { ...newTodos[index], ...responseTodo });
          }

          return newTodos;
        });
      })
      .catch(error => {
        handleErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingIds(currentIds =>
          currentIds.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const handleSubmitUpdateTodo = (todo: Todo) => {
    const trimmedTitle = editedTodoTitle.trim();

    if (!trimmedTitle) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    if (todo.title === trimmedTitle) {
      setEditedTodoTitle('');
      handleEditTodo(null);

      return;
    }

    updateTodo({ ...todo, title: trimmedTitle }).then(() => {
      setEditedTodoTitle('');
      handleEditTodo(null);
    });
  };

  const handleToggleCompleted = (todo: Todo) => {
    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      todos.forEach(todo => {
        updateTodo({
          ...todo,
          completed: false,
        });
      });
    } else {
      const unCompletedTodos = todos.filter(todo => !todo.completed);

      unCompletedTodos.forEach(todo => {
        updateTodo({
          ...todo,
          completed: true,
        });
      });
    }
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoSubmit={onTodoSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isDisabled={isDisabled}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          isAllCompleted={isAllCompleted}
          isToggleButtonHidden={isToggleButtonHidden}
        />

        <TodoList
          filterBy={filterBy}
          filtredTodos={filtredTodos}
          deleteTodo={deleteTodo}
          processingIds={processingIds}
          editedTodo={editedTodo}
          handleEditTodo={handleEditTodo}
          editedTodoTitle={editedTodoTitle}
          setEditedTodoTitle={setEditedTodoTitle}
          handleSubmitUpdateTodo={handleSubmitUpdateTodo}
          tempTodo={tempTodo}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          handleTogleCompleted={handleToggleCompleted}
          handleErrorMessage={handleErrorMessage}
          renameCallBack={renameCallback}
        />

        <Footer
          todos={todos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          anyCompleted={anyCompleted}
          clearCompleted={clearCompleted}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={errorMessage} isHidden={isErrorHidden} />
    </div>
  );
};

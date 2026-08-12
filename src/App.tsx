/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';

import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { UserWarning } from './UserWarning';

import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/todoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

const USER_ID = 4412;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClearing, setIsClearing] = useState(false);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const filters = [
    {
      label: 'All',
      value: Filter.All,
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      value: Filter.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      value: Filter.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = () => {
    setError('');
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const removeTodo = (todoId: number) => {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsClearing(true);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfullyDeletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !successfullyDeletedIds.includes(todo.id),
          ),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError(ErrorMessage.Delete);
        }
      })
      .finally(() => {
        setIsClearing(false);
        inputRef.current?.focus();
      });
  };

  const changeTodoStatus = (todoId: number, completed: boolean) => {
    setUpdatingTodoIds(currentIds => [...currentIds, todoId]);

    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const toggleAll = () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      changeTodoStatus(todo.id, newCompletedStatus);
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEditing = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      removeTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setUpdatingTodoIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );

        setEditingTodoId(null);
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      });
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          allCompleted={allCompleted}
          toggleAll={toggleAll}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          title={title}
          setTitle={setTitle}
          isDisabled={tempTodo !== null}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
              editingTodoId={editingTodoId}
              editingTitle={editingTitle}
              setEditingTitle={setEditingTitle}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEditing={saveEditing}
              changeTodoStatus={changeTodoStatus}
              removeTodo={removeTodo}
              editInputRef={editInputRef}
            />

            <Footer
              todos={todos}
              filter={filter}
              filters={filters}
              setFilter={setFilter}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};

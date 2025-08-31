/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import cn from 'classnames';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filters';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setIsLoading(true);

    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorTypes.LoadTodos);
        window.setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        newTodoFieldRef.current?.focus();
      });
  }, []);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const visibleTodos = todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorTypes.EmptyTitle);
      setNewTodoTitle('');
      newTodoFieldRef.current?.focus();

      return;
    }

    const newTodoItem = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setIsAdded(true);
    setTemporaryTodo(newTodoItem);

    addTodo(newTodoItem)
      .then(({ id, userId, title: todoTitle, completed }) => {
        const newTodo = {
          id,
          userId,
          title: todoTitle,
          completed,
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');

        newTodoFieldRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.AddTodo);
        newTodoFieldRef.current?.focus();
      })
      .finally(() => {
        setIsAdded(false);
        setTemporaryTodo(null);
        newTodoFieldRef.current?.focus();
      });
  };

  const handleDeleteTodo = (id: number) => {
    setDeleteId(prevId => [...prevId, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.DeleteTodo);

        return Promise.reject();
      })
      .finally(() => {
        setDeleteId(prev => prev.filter(prevId => prevId !== id));

        newTodoFieldRef.current?.focus();
      });
  };

  const handleToggleStatus = (id: number, completed: boolean) => {
    setLoadingIds(prevIds => [...prevIds, id]);

    updateTodo(id, { completed: !completed })
      .then(() => {
        setTodos(listOfTodos =>
          listOfTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !completed,
              };
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UpdateTodo);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(prevId => prevId !== id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const promises = todosToUpdate.map(todo => {
      return updateTodo(todo.id, { completed: newStatus });
    });

    Promise.all(promises)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: newStatus,
          })),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UpdateTodo);
      })
      .finally(() => {
        setLoadingIds([]);
      });
  };

  const handleUpdateTitle = (id: number, title: string) => {
    const trimmedTitle = title.trim();
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    if (trimmedTitle === todoToUpdate.title) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedTitle === '') {
      setLoadingIds(prevIds => [...prevIds, id]);

      handleDeleteTodo(id)
        .then(() => {
          setEditingTodoId(null);
        })
        .catch(() => {})
        .finally(() => {
          setLoadingIds(prev => prev.filter(prevId => prevId !== id));
        });

      return;
    }

    setLoadingIds(prevIds => [...prevIds, id]);

    updateTodo(id, { title: trimmedTitle })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: trimmedTitle } : todo,
          ),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UpdateTodo);
      })
      .finally(() => {
        newTodoFieldRef.current?.focus();
        setLoadingIds(prevIds => prevIds.filter(prevId => prevId !== id));
      });
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdded) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdded]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && isLoading === false && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAdded}
              ref={newTodoFieldRef}
            />
          </form>
        </header>

        {isLoading && <div className="loader"></div>}

        <TodoList
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          deleteId={deleteId}
          temporaryTodo={temporaryTodo}
          handleToggleStatus={handleToggleStatus}
          editingTodoId={editingTodoId}
          handleUpdateTitle={handleUpdateTitle}
          setEditingTodoId={setEditingTodoId}
          loadingIds={loadingIds}
        />

        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};

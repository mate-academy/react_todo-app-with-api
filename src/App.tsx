/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { changeTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { FilterTodo, LoadingItem, Todo } from './types/Todo';

import { ListTodo } from './components/ListTodo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

import { loadingList } from './utils/loadingList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(FilterTodo.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingItems, setIsLoadingItems] = useState<LoadingItem[]>([]);
  const [deleteItem, setDeleteItem] = useState(false);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    setCompletedTodos(todos.filter(todo => todo.completed));
    setIsLoadingItems(loadingList(todos));
    setDeleteItem(false);
  }, [todos]);

  const filterTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterTodo.active:
          return !todo.completed;

        case FilterTodo.completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const onDelete = useCallback((id: number) => {
    setTimeout(() => {
      setTodos(prevState =>
        prevState.filter(todo => {
          return todo.id !== id;
        }),
      );
    }, 1000);
  }, []);

  const handleClearCompleted = () => {
    setDeleteItem(true);

    Promise.allSettled(
      completedTodos.map(({ id }) =>
        deleteTodo(id)
          .then(() => {
            setTodos(prevState => {
              return prevState.filter(todo => todo.id !== id);
            });
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            setTimeout(() => setErrorMessage(''), 3000);
          })
          .finally(() => setDeleteItem(false)),
      ),
    );
  };

  const toggleAll = (activeButton: boolean) => {
    todos.forEach(todo => {
      if (todo.completed === activeButton) {
        setIsLoadingItems(currentState => {
          return currentState.map(currentItem => {
            return todo.id === currentItem.id
              ? { ...currentItem, isLoading: true }
              : currentItem;
          });
        });

        changeTodo(todo.id, { ...todo, completed: !activeButton })
          .then(updatedTodo => {
            setTodos(currentTodos => {
              return currentTodos.map(cuurentTodo => {
                return updatedTodo.id === cuurentTodo.id
                  ? updatedTodo
                  : cuurentTodo;
              });
            });
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');
            setTimeout(() => setErrorMessage(''), 3000);
          })
          .finally(() => {
            setIsLoadingItems(currentState => {
              return currentState.map(currentItem => {
                return { ...currentItem, isLoading: false };
              });
            });
          });
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          toggleAll={toggleAll}
          deleteItem={deleteItem}
        />

        <ListTodo
          tempTodo={tempTodo}
          todos={filterTodos}
          setTodos={setTodos}
          onDelete={onDelete}
          setErrorMessage={setErrorMessage}
          isLoadingItems={isLoadingItems}
          setDeleteItem={setDeleteItem}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            setFilter={setFilter}
            filter={filter}
            completedTodos={completedTodos}
            onRemoveCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

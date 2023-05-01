/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Error } from './types/Error';

import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';

const USER_ID = 6969;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.None);
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedIds, setLoadedIds] = useState<number[]>([]);

  const removeError = () => {
    setErrorMessage(Error.None);
  };

  const throwError = useCallback((errorType: Error) => {
    setErrorMessage(errorType);
    setTimeout(() => {
      removeError();
    }, 3000);
  }, []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => setTodos(result))
      .catch(() => {
        throwError(Error.Load);
      });
  }, []);

  const addTodo = useCallback((title: string) => {
    setDisabledInput(true);

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(result => {
        setTodos(prevState => [...prevState, result]);
      })
      .catch(() => {
        throwError(Error.Add);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });
  }, []);

  const removeTodo = useCallback((id: number) => {
    setLoadedIds(prevState => [...prevState, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        throwError(Error.Delete);
      })
      .finally(() => {
        setLoadedIds(state => state.filter(el => el !== id));
      });
  }, []);

  const updateTodo = useCallback((
    id: number,
    data: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => {
    setLoadedIds(prevState => [...prevState, id]);

    patchTodo(id, data)
      .then(() => {
        setTodos(prevState => prevState.map(todo => {
          if (todo.id === id) {
            return { ...todo, ...data };
          }

          return todo;
        }));
      })
      .catch(() => {
        throwError(Error.Update);
      })
      .finally(() => {
        setLoadedIds(state => state.filter(el => el !== id));
      });
  }, []);

  const removeCompleted = () => {
    const completeTodoList = todos.filter(todo => todo.completed);

    completeTodoList.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(order => !order.completed));
        })
        .catch(() => {
          throwError(Error.Delete);
        });
    });
  };

  const toggleAll = useCallback(() => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false });
      });
    } else if (todos.every(todo => !todo.completed)) {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: true });
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodo(todo.id, { completed: true });
        }
      });
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      throwError(Error.Title);
    } else {
      addTodo(query);
      setQuery('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleAll={toggleAll}
          handleSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
          disabledInput={disabledInput}
        />

        {!!todos.length && (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            loadedIds={loadedIds}
            removeTodo={removeTodo}
            removeCompleted={removeCompleted}
            updateTodo={updateTodo}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => throwError(Error.None)}
        />

        {errorMessage}
      </div>
    </div>
  );
};

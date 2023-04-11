/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';

const USER_ID = 6969;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedIds, setLoadedIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => setTodos(result))
      .catch(() => {
        setError('load');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (title: string) => {
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
        setError('add');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (id: number) => {
    setLoadedIds(prevState => [...prevState, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('delete');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setLoadedIds(state => state.filter(el => el !== id));
      });
  };

  const updateTodo = (
    id: number, data: Partial<Omit<Todo, 'id' | 'userId'>>,
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
        setError('update');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setLoadedIds(state => state.filter(el => el !== id));
      });
  };

  const removeCompleted = () => {
    const completeTodoList = todos.filter(todo => todo.completed);

    completeTodoList.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(order => !order.completed));
        })
        .catch(() => {
          setError('delete');
          setTimeout(() => {
            setError('');
          }, 3000);
        });
    });
  };

  const toggleAll = () => {
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
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setError('add');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      addTodo(query);
      setQuery('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            onClick={toggleAll}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabledInput}
            />
          </form>
        </header>

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
        { hidden: !error },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        { `Unable to ${error} a todo` }
      </div>
    </div>
  );
};

/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList/TodosList';

const USER_ID = 6937;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [completedId, setCompletedId] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const waitErrorEnable = () => {
    setTimeout(() => {
      setHasError('');
    }, 3000);
  };

  const addTodo = (title: string) => {
    setIsDisabledInput(true);

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    postTodo(newTodo)
      .then(data => {
        setTodos(prevState => [...prevState, data]);
      })
      .catch(() => {
        setHasError('Unable to add a todo');
        waitErrorEnable();
      })
      .finally(() => {
        setTempTodo(undefined);
        setIsDisabledInput(false);
      });
  };

  const removeTodo = (id: number) => {
    setCompletedId(state => [...state, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setHasError('Unable to delete a todo');
        waitErrorEnable();
      })
      .finally(() => {
        setCompletedId(state => state.filter(el => el !== id));
      });
  };

  const removeCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    setIsDeleting(true);

    completed.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setIsDeleting(false);
          setTodos(todos.filter(task => !task.completed));
        })
        .catch(() => {
          setIsDeleting(false);
          setHasError('Unable to delete todos');
        });
    });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setHasError('Tittle can not be empty');
      waitErrorEnable();

      return;
    }

    addTodo(query);
    setQuery('');
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    setCompletedId(state => [...state, id]);

    try {
      await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      }));
    } catch {
      setHasError('Unable to update a todo');
    } finally {
      setCompletedId(state => state.filter(el => el !== id));
    }
  };

  const handleToggleAll = () => {
    const allTodosCompleted = todos.every(todo => todo.completed);

    if (allTodosCompleted) {
      todos.forEach(todo => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      const todosNotCompleted = todos.filter(todo => !todo.completed);

      todosNotCompleted.forEach(todo => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(() => {
        setHasError('Unable to load a todo');
        waitErrorEnable();
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleToggleAll}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleInput}
              disabled={isDisabledInput}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodosList
            todos={todos}
            tempTodo={tempTodo}
            onDeleteTodo={removeTodo}
            onDeleteCompleted={removeCompleted}
            onUpdateTodo={handleUpdateTodo}
            completedId={completedId}
            isDeleting={isDeleting}
          />
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !hasError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            setHasError('');
          }}
        />

        {hasError && (
          hasError
        )}
      </div>
    </div>
  );
};

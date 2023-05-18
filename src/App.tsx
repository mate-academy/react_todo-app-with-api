/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import CN from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos, postTodo, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Options } from './types/Options';

import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';

const USER_ID = 10349;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const [todoIdsInUpdating, setTodoIdsInUpdating] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [option, setOption] = useState(Options.ALL);
  const [error, setError] = useState('');

  const visibleTodos = todos.filter(todo => {
    switch (option) {
      case Options.ACTIVE:
        return !todo.completed;
      case Options.COMLETED:
        return todo.completed;
      default:
        return todo;
    }
  });

  const isActiveTodo = visibleTodos.every(todo => {
    return todo.completed;
  });

  const isSomeCompleted = visibleTodos.some(todo => {
    return todo.completed;
  });
  // //////////////////////////////////
  const handleAllTodosStatusEdit = () => {
    let toggleTodo: Todo[] = [];

    if (isSomeCompleted) {
      toggleTodo = todos
        .map((todo) => {
          const clonedTodo = { ...todo };

          clonedTodo.completed = true;

          return clonedTodo;
        });
    } else {
      toggleTodo = todos.map((todo) => {
        const clonedTodo = { ...todo };

        clonedTodo.completed = false;

        return clonedTodo;
      });
    }

    setTodoIdsInUpdating(toggleTodo.map((todo) => todo.id));

    Promise.all(
      toggleTodo.map((todo) => {
        return patchTodo(todo.id, { completed: todo.completed });
      }),
    )
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.map((prevTodo) => {
            const updatedTodoIndex = toggleTodo.findIndex(
              (todo) => todo.id === prevTodo.id,
            );
            const isUpdatedTodo = updatedTodoIndex > -1;

            if (isUpdatedTodo) {
              return toggleTodo[updatedTodoIndex];
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setTodoIdsInUpdating([]));
  };
  // /////////////////////////////////////

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(errorMessage => setError(errorMessage));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const handleDeleteComleted = () => {
    const completedTodo = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodo.map((todoId) => deleteTodo(todoId)))
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.filter((prevTodo) => !prevTodo.completed);
        });
      })
      .catch(() => {
        setError('Unable to delete todos');
      });
  };

  const handleOption = useCallback((value: Options) => {
    setOption(value);
  }, []);

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title) {
      setError('Title can\'t be empty');

      return;
    }

    const todo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsCreatingTodo(true);

    setTempoTodo({ ...todo, id: 0 });

    postTodo(todo)
      .then((newTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsCreatingTodo(false);
        setTempoTodo(null);
      });
    setTitle('');
  };

  const isClearButton = isSomeCompleted ? undefined : true;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={CN(
              'todoapp__toggle-all',
              { active: isActiveTodo },
            )}
            onClick={handleAllTodosStatusEdit}
          />

          <form
            onSubmit={handleSubmitForm}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
              disabled={isCreatingTodo}
            />
          </form>
        </header>
        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempoTodo={tempoTodo}
              setTodos={setTodos}
              setError={setError}
              todoIdsInUpdating={todoIdsInUpdating}
            />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todos.length} items left`}
              </span>

              <Filter option={option} onFilterChange={handleOption} />

              <button
                type="button"
                style={{ visibility: isClearButton && 'hidden' }}
                className="todoapp__clear-completed"
                onClick={handleDeleteComleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div className={CN(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
      >

        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};

/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import './styles/index.scss';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import {
  getTodos, createTodo, deleteTodo, changeStatus,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const idTodoToAdd = 0;
  const idTodoToChange = -1;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState(idTodoToChange);
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => (setErrMessage('')), 3000);

    return () => clearInterval(timerId);
  }, [errMessage]);

  const toggleIsLoading = useCallback((
    property: keyof Todo,
    condition: number | boolean,
    toggle: boolean,
  ) => {
    setTodos(prevState => {
      const copyPrev = [...prevState];

      copyPrev.forEach(todo => {
        if (todo[`${property}`] === condition) {
          todo.isLoading = toggle;
        }
      });

      return [...copyPrev];
    });
  }, [todos]);

  const addTodo = useCallback(async () => {
    setErrMessage('');

    if (!user) {
      return;
    }

    if (query.length === 0) {
      setErrMessage('Title can\'t be empty');

      return;
    }

    setTodos(prevState => {
      const newTodo: Todo = {
        id: idTodoToAdd,
        title: query,
        userId: user.id,
        completed: false,
        isLoading: true,
      };

      return [...prevState, newTodo];
    });

    try {
      const newTodo = await createTodo(query, user.id);
      const indexNewTodo = todos.findIndex(todo => todo.id === 0);

      setTodos(prevState => {
        const copy = [...prevState];

        copy.splice(indexNewTodo, 1, newTodo);

        return copy;
      });
    } catch {
      setTodos(prevState => prevState.filter(todo => todo.id !== idTodoToAdd));
      setErrMessage('Unable to add a todo');
    }

    setQuery('');
  }, [toggleIsLoading, createTodo, user, query]);

  const removeTodo = useCallback(async (id: number) => {
    setErrMessage('');

    if (!user) {
      return;
    }

    toggleIsLoading('id', id, true);

    try {
      await deleteTodo(id);

      setTodos(prev => {
        return prev.filter(el => el.isLoading !== true);
      });
    } catch {
      toggleIsLoading('id', id, false);
      setErrMessage('Unable to delete a todo');
    }
  }, [toggleIsLoading, deleteTodo, user]);

  const changeStatusTodo = useCallback(async (id: number, status: boolean) => {
    setErrMessage('');

    if (!user) {
      return;
    }

    toggleIsLoading('id', id, true);

    try {
      await changeStatus(
        id,
        { completed: !status },
      );

      setTodos(prevState => {
        const copyPrev = [...prevState];

        copyPrev.forEach(todo => {
          if (todo.id === id) {
            todo.completed = !status;
          }
        });

        return [...copyPrev];
      });
    } catch {
      setErrMessage('Unable to update a todo');
    } finally {
      toggleIsLoading('id', id, false);
    }
  }, [toggleIsLoading, changeStatus, user]);

  const changeStatusAllTodos = useCallback(async () => {
    setErrMessage('');

    const checkAllTrue = todos.every(el => el.completed === true);

    if (checkAllTrue) {
      toggleIsLoading('completed', true, true);

      try {
        const toCompletedFalse = await Promise.all(
          todos.map(todo => changeStatus(todo.id, { completed: false })),
        );

        setTodos(toCompletedFalse);
      } catch {
        setErrMessage('Unable to update a todo');
      } finally {
        toggleIsLoading('completed', true, false);
      }
    } else {
      toggleIsLoading('completed', false, true);

      const completedTodos = todos.filter(todo => todo.completed);
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      try {
        const toCompletedTrue = await Promise.all(
          uncompletedTodos.map(todo => changeStatus(
            todo.id,
            { completed: true },
          )),
        );

        const preparedTodos = [...completedTodos, ...toCompletedTrue];

        preparedTodos.sort((a, b) => a.id - b.id);

        setTodos(preparedTodos);
      } catch {
        setErrMessage('Unable to update a todo');
      } finally {
        toggleIsLoading('completed', true, false);
      }
    }
  }, [toggleIsLoading, changeStatus, user, todos]);

  const clearCompleted = useCallback(async () => {
    setErrMessage('');

    const todosToDelete = todos.filter(todo => todo.completed);

    toggleIsLoading('completed', true, true);

    try {
      await Promise.all(
        todosToDelete.map(todo => deleteTodo(todo.id)),
      );

      setTodos(prevState => prevState.filter(todo => {
        return !(todosToDelete.some(todoEl => todoEl.id === todo.id));
      }));
    } catch {
      setErrMessage('Unable to update a todo');
    } finally {
      toggleIsLoading('completed', true, false);
    }
  }, [toggleIsLoading, deleteTodo, user, todos]);

  const changeTitleTodo = useCallback(async () => {
    setErrMessage('');

    if (title.length === 0) {
      removeTodo(selectedId);

      return;
    }

    const todoChanging = todos.find(todo => todo.id === selectedId);

    if (todoChanging !== undefined
      && todoChanging.title !== title) {
      let prevTitle = '';

      setTodos(prevState => {
        const copyPrev = [...prevState];

        copyPrev.forEach(todo => {
          if (todo.id === selectedId) {
            prevTitle = todo.title;
            todo.title = title;
            todo.isLoading = true;
          }
        });

        return [...copyPrev];
      });

      try {
        await changeStatus(
          selectedId,
          { title },
        );
      } catch {
        setTodos(prevState => {
          const copyPrev = [...prevState];

          copyPrev.forEach(todo => {
            if (todo.id === selectedId) {
              todo.title = prevTitle;
            }
          });

          return [...copyPrev];
        });
        setErrMessage('Unable to update a todo');
      } finally {
        toggleIsLoading('id', selectedId, false);
      }
    }

    setSelectedId(0);
  }, [toggleIsLoading, changeStatus, user, title, selectedId]);

  const haveOneCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    setErrMessage('');

    switch (filter) {
      case FilterTypes.Active:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.Completed:
        return todos.filter(todo => todo.completed);

      case FilterTypes.All:
        return todos;

      default:
        return todos;
    }
  }, [filter, todos]);

  const allTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const availabilityTodos = useMemo(() => {
    return todos.length > 0;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: allTodosCompleted },
              { hidden: !availabilityTodos },
            )}
            onClick={changeStatusAllTodos}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value.trim())}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {availabilityTodos
          && (
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              setTodos={setTodos}
              changeStatusTodo={changeStatusTodo}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              title={title}
              setTitle={setTitle}
              changeTitleTodo={changeTitleTodo}
            />
          )}
        </section>

        {availabilityTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${
                todos.length
                - todos.filter(todo => todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className="filter__link selected"
                onClick={() => setFilter(FilterTypes.All)}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className="filter__link"
                onClick={() => setFilter(FilterTypes.Active)}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className="filter__link"
                onClick={() => setFilter(FilterTypes.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                { hidden: !haveOneCompletedTodos },
              )}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {errMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrMessage('')}
          />
          {errMessage}
        </div>
      )}
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */
import React,
{
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
}
  from 'react';

import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import './styles/index.scss';
import { Todo } from './types/Todo';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';

enum FilterTypes {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const todoToAddId = 0;
  const todoToChangeId = -1;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.ALL);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState(todoToChangeId);
  const [errorNotification, setErrorNotification] = useState('');

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
    const timerId = setTimeout(() => (setErrorNotification('')), 3000);

    return () => clearInterval(timerId);
  }, [errorNotification]);

  const isLoadingToggle = useCallback((
    property: keyof Todo,
    condition: number | boolean,
    toggle: boolean,
  ) => {
    setTodos(prevState => {
      const prevCopy = [...prevState];

      prevCopy.forEach(todo => {
        if (todo[`${property}`] === condition) {
          todo.isLoading = toggle;
        }
      });

      return [...prevCopy];
    });
  }, [todos]);

  const createTodo = useCallback(async () => {
    setErrorNotification('');

    if (!user) {
      return;
    }

    if (query.length === 0) {
      setErrorNotification('Title can\'t be empty');

      return;
    }

    setTodos(prevState => {
      const newTodo: Todo = {
        id: todoToAddId,
        title: query,
        userId: user.id,
        completed: false,
        isLoading: true,
      };

      return [...prevState, newTodo];
    });

    try {
      const newTodo = await addTodo(query, user.id);
      const newTodoIndex = todos.findIndex(todo => todo.id === 0);

      setTodos(prevState => {
        const copy = [...prevState];

        copy.splice(newTodoIndex, 1, newTodo);

        return copy;
      });
    } catch {
      setTodos(prevState => prevState.filter(todo => todo.id !== todoToAddId));
      setErrorNotification('Unable to add a todo');
    }

    setQuery('');
  }, [isLoadingToggle, addTodo, user, query]);

  const removeTodo = useCallback(async (id: number) => {
    setErrorNotification('');

    if (!user) {
      return;
    }

    isLoadingToggle('id', id, true);

    try {
      await deleteTodo(id);

      setTodos(prev => {
        return prev.filter(el => el.isLoading !== true);
      });
    } catch {
      isLoadingToggle('id', id, false);
      setErrorNotification('Unable to delete a todo');
    }
  }, [isLoadingToggle, deleteTodo, user]);

  const updateTodoStatus = useCallback(async (id: number, status: boolean) => {
    setErrorNotification('');

    if (!user) {
      return;
    }

    isLoadingToggle('id', id, true);

    try {
      await updateTodo(
        id,
        { completed: !status },
      );

      setTodos(prevState => {
        const prevCopy = [...prevState];

        prevCopy.forEach(todo => {
          if (todo.id === id) {
            todo.completed = !status;
          }
        });

        return [...prevCopy];
      });
    } catch {
      setErrorNotification('Unable to update a todo');
    } finally {
      isLoadingToggle('id', id, false);
    }
  }, [isLoadingToggle, updateTodo, user]);

  const updateTodoAllTodos = useCallback(async () => {
    setErrorNotification('');

    const inspectTodoTrue = todos.every(element => element.completed === true);

    if (inspectTodoTrue) {
      isLoadingToggle('completed', true, true);

      try {
        const todoFalseCompleted = await Promise.all(
          todos.map(todo => updateTodo(todo.id, { completed: false })),
        );

        setTodos(todoFalseCompleted as Todo[]);
      } catch {
        setErrorNotification('Unable to update a todo');
      } finally {
        isLoadingToggle('completed', true, false);
      }
    } else {
      isLoadingToggle('completed', false, true);

      const completedTodos = todos.filter(todo => todo.completed);
      const uncompletedTodos = todos.filter(todo => !todo.completed);

      try {
        const todoTrueCompleted = await Promise.all(
          uncompletedTodos.map(todo => updateTodo(
            todo.id,
            { completed: true },
          )),
        );

        const preparedTodos = [...completedTodos, ...todoTrueCompleted];

        (preparedTodos as Todo[]).sort((a, b) => a.id - b.id);

        setTodos(preparedTodos as Todo[]);
      } catch {
        setErrorNotification('Unable to update a todo');
      } finally {
        isLoadingToggle('completed', true, false);
      }
    }
  }, [isLoadingToggle, updateTodo, user, todos]);

  const clearCompleted = useCallback(async () => {
    setErrorNotification('');

    const todosToDelete = todos.filter(todo => todo.completed);

    isLoadingToggle('completed', true, true);

    try {
      await Promise.all(
        todosToDelete.map(todo => deleteTodo(todo.id)),
      );

      setTodos(prevState => prevState.filter(todo => {
        return !(todosToDelete.some(todoEl => todoEl.id === todo.id));
      }));
    } catch {
      setErrorNotification('Unable to update a todo');
    } finally {
      isLoadingToggle('completed', true, false);
    }
  }, [isLoadingToggle, deleteTodo, user, todos]);

  const editTodoTitle = useCallback(async () => {
    setErrorNotification('');

    if (title.length === 0) {
      removeTodo(selectedId);

      return;
    }

    const todoChanging = todos.find(todo => todo.id === selectedId);

    if (todoChanging !== undefined
      && todoChanging.title !== title) {
      let prevTitle = '';

      setTodos(prevState => {
        const prevCopy = [...prevState];

        prevCopy.forEach(todo => {
          if (todo.id === selectedId) {
            prevTitle = todo.title;
            todo.title = title;
            todo.isLoading = true;
          }
        });

        return [...prevCopy];
      });

      try {
        await updateTodo(
          selectedId,
          { title },
        );
      } catch {
        setTodos(prevState => {
          const prevCopy = [...prevState];

          prevCopy.forEach(todo => {
            if (todo.id === selectedId) {
              todo.title = prevTitle;
            }
          });

          return [...prevCopy];
        });
        setErrorNotification('Unable to update a todo');
      } finally {
        isLoadingToggle('id', selectedId, false);
      }
    }

    setSelectedId(0);
  }, [isLoadingToggle, updateTodo, user, title, selectedId]);

  const onlyOneTodoCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    setErrorNotification('');

    switch (filter) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterTypes.ALL:
        return todos;

      default:
        return todos;
    }
  }, [filter, todos]);

  const allTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const todosAvailable = useMemo(() => {
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
              { hidden: !todosAvailable },
            )}
            onClick={updateTodoAllTodos}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createTodo();
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
          {todosAvailable
          && (
            <TodoList
              todos={filteredTodos}
              setTodos={setTodos}
              editTodoStatus={updateTodoStatus}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              title={title}
              setTitle={setTitle}
              editTodoTitle={editTodoTitle}
              deleteTodo={deleteTodo}
            />
          )}
        </section>
        {todosAvailable && (
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
                onClick={() => setFilter(FilterTypes.ALL)}
              >
                All
              </a>
              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className="filter__link"
                onClick={() => setFilter(FilterTypes.ACTIVE)}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className="filter__link"
                onClick={() => setFilter(FilterTypes.COMPLETED)}
              >
                Completed
              </a>
            </nav>
            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                { hidden: !onlyOneTodoCompleted },
              )}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {errorNotification && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorNotification('')}
          />
          {errorNotification}
        </div>
      )}
    </div>
  );
};

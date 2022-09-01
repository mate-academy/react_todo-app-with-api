/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Finished',
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const showClearCompleted = preparedTodos.some(todo => todo.completed);
  const hideAll = todos.length === 0;

  // should I create additional useEffects for every logical function
  // or beter add everything to one useEffect?

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      client.get<Todo[]>(`/todos?userId=${user.id}`)
        .then(res => {
          setTodos(res);
        });
    }
  }, []);

  useEffect(() => {
    switch (filterType) {
      case FilterType.All:
        setPreparedTodos(todos);
        break;
      case FilterType.Active:
        setPreparedTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterType.Completed:
        setPreparedTodos(todos.filter(todo => todo.completed));
        break;
      default:
        throw new Error('Invalid filter type');
    }
  }, [filterType, todos]);

  const onDelete = (todoId: number) => {
    setTodos(state => state.filter(todo => todo.id !== todoId));
  };

  const onError = (errorText: string) => {
    setErrorTitle(errorText);

    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const onChange = (todo: Todo) => {
    setTodos(state => {
      const newTodos = [...state];
      const targetIndex = newTodos.findIndex(el => el.id === todo.id);

      if (targetIndex === -1) {
        return newTodos;
      }

      newTodos.splice(targetIndex, 1, todo);

      return newTodos;
    });
  };

  const handleToggleAll = () => {
    const toggleTo = todos.some(todo => !todo.completed);

    setPreparedTodos(state => {
      const newState = [...state].map(todo => {
        if (todo.completed !== toggleTo) {
          const loadingTodo = {
            ...todo,
            isLoading: true,
          };

          return loadingTodo;
        }

        return todo;
      });

      return newState;
    });

    Promise.all(todos
      .filter(todo => todo.completed !== toggleTo)
      .map(todo => {
        const newTodo = { ...todo, completed: !todo.completed };

        return client.patch<Todo>(`/todos/${todo.id}`, newTodo)
          .then(res => onChange(res))
          .catch(() => {
            onError('Unable to update a todo');
          });
      }));
  };

  const handleAddNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoField.current && newTodoField.current.value.trim() === '') {
      onError('Title can\'t be empty');

      return;
    }

    if (user && newTodoField.current) {
      const newTodo = {
        title: newTodoField.current.value,
        userId: user.id,
        completed: false,
        isLoading: true,
        id: -(todos.length),
      };

      setTodos(state => [...state, newTodo]);

      client.post<Todo>(`/todos?userId=${user?.id}`, {
        title: newTodoField.current.value,
        userId: user.id,
        completed: false,
      })
        .then(res => {
          setTodos(state => {
            const newState = [...state].filter(el => el.id !== newTodo.id);

            if (newTodoField.current) {
              newTodoField.current.value = '';
            }

            return [...newState, res];
          });
        })
        .catch(() => {
          onError('Unable to add a todo');
          setTodos(state => {
            const newState = [...state].filter(el => el.id !== newTodo.id);

            return [...newState];
          });
        });
    }
  };

  const handleDeleteCompleted = () => {
    setPreparedTodos(state => {
      const newState = [...state].map(todo => {
        if (todo.completed) {
          const loadingTodo = {
            ...todo,
            isLoading: true,
          };

          return loadingTodo;
        }

        return todo;
      });

      return newState;
    });

    Promise.all(todos
      .filter(todo => todo.completed)
      .map(todo => {
        return client.delete(`/todos/${todo.id}`)
          .then(() => onDelete(todo.id))
          .catch(() => {
            onError('Unable to delete a todo');
          });
      }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!hideAll && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
              onClick={() => handleToggleAll()}
            />
          )}

          <form onSubmit={(e) => handleAddNewTodo(e)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {!hideAll && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {preparedTodos.map(todo => (
                <TodoItem
                  todo={todo}
                  onDelete={onDelete}
                  onChange={onChange}
                  onError={onError}
                  key={todo.id}
                />
              ))}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todos.filter(todo => !todo.completed).length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === FilterType.All },
                  )}
                  onClick={() => setFilterType(FilterType.All)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === FilterType.Active },
                  )}
                  onClick={() => setFilterType(FilterType.Active)}
                >
                  Active
                </a>

                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === FilterType.Completed },
                  )}
                  onClick={() => setFilterType(FilterType.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={() => handleDeleteCompleted()}
                hidden={!showClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {errorTitle}
        </div>
      )}
    </div>
  );
};

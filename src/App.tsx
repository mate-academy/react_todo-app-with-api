/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import './app.scss';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import {
  getTodos, createTodo, deleteTodo, changeStatus,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  // const [titleTodo, setTitleTodo] = useState('');
  // const [showInput, setShowInput] = useState(false);

  const onlyForLinter = {
    linter: 'Back off!',
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos);
    }

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addTodo = async () => {
    if (!user) {
      return onlyForLinter;
    }

    if (!query) {
      throw Error('empty');
    }

    setTodos(prevState => {
      const newTodo: Todo = {
        id: 0,
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
    } catch (err) {
      // console.log(err);
    }

    setQuery('');

    return onlyForLinter;
  };

  const removeTodo = async (id: number) => {
    if (user) {
      setTodos(prevState => {
        prevState.forEach(el => {
          if (el.id === id) {
            // eslint-disable-next-line no-param-reassign
            el.isLoading = true;
          }
        });

        return [...prevState];
      });

      try {
        await deleteTodo(id);

        setTodos(prev => {
          return prev.filter(el => el.isLoading !== true);
        });
      } catch {
        // setDefaultResultOrder()
      }
    }
  };

  const changeStatusTodo = async (id: number, status: boolean) => {
    if (user) {
      setTodos(prevState => {
        prevState.forEach(el => {
          if (el.id === id) {
            el.isLoading = true;
          }
        });

        return [...prevState];
      });

      try {
        await changeStatus(
          id,
          { completed: !status },
        );

        setTodos(prevState => {
          prevState.forEach(el => {
            if (el.id === id) {
              el.isLoading = false;
              el.completed = !status;
            }
          });

          return [...prevState];
        });
      } catch {
        // throw new Error('Something failed');
      }
    }
  };

  const changeStatusAllTodos = async () => {
    const checkAllTrue = todos.every(el => el.completed === true);

    if (checkAllTrue) {
      setTodos(prevState => {
        prevState.forEach(el => {
          el.isLoading = true;
        });

        return [...prevState];
      });

      const toCompletedFalse = await Promise.all(
        todos.map(todo => changeStatus(todo.id, { completed: false })),
      );

      setTodos(toCompletedFalse);

      setTodos(prevState => {
        prevState.forEach(el => {
          el.isLoading = false;
        });

        return [...prevState];
      });
    } else {
      setTodos(prevState => {
        const copyPrev = [...prevState];

        copyPrev.forEach(todo => {
          if (todo.completed === false) {
            todo.isLoading = true;
          }
        });

        return [...copyPrev];
      });

      // создать константу с отфильтрованными тудушками и передавать в промисс.алл
      // const todosToChange = todos.filter(todo => );

      const toCompletedTrue = await Promise.all(
        todos.map(todo => changeStatus(todo.id, { completed: true })),
      );

      setTodos(toCompletedTrue);

      setTodos(prevState => {
        const copyPrev = [...prevState];

        copyPrev.forEach(todo => {
          todo.isLoading = false;
        });

        return [...copyPrev];
      });
    }
  };

  const filteredTodos = useMemo(() => {
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

  const clearCompleted = async () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    setTodos(prevState => {
      const copyPrev = [...prevState];

      copyPrev.forEach(todo => {
        if (todo.completed === true) {
          todo.isLoading = true;
        }
      });

      return [...copyPrev];
    });

    await Promise.all(
      todosToDelete.map(todo => deleteTodo(todo.id)),
    );

    setTodos(prevState => prevState.filter(todo => {
      return !(todosToDelete.some(todoEl => todoEl.id === todo.id));
    }));
  };

  const availabilityCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
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
          {todos.length > 0
          && (
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              setTodos={setTodos}
              changeStatusTodo={changeStatusTodo}
            />
          )}

          <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">HTML</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue="JS"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">React</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">Redux</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section>

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
              { 'button-clearCompleted': !availabilityCompletedTodos },
            )}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};

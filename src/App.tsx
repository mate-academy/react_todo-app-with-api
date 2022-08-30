/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  addTodo,
  changeComplete,
  getTodos,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

type ErrorStr = (
  'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo'
  | "Title can't be empty"
  | null
  );

// const errorArr = [null, 'Unable to add a todo', 'Unable to delete a todo', 'Unable to update a todo', "Title can't be empty"]

export const App: React.FC<{}> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorStr>(null);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [isComplited, setIsComplited] = useState(true);
  const [isToggle, setIsToggle] = useState(false);
  // const [visibleTodos, setVisibleTodos] = useState(todos);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res));
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const errorMsg = useCallback((msg: ErrorStr) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  }, []);

  const handleSubmit = () => {
    setError(null);

    if (query === '') {
      errorMsg("Title can't be empty");

      return;
    }

    if (user) {
      const newTodo = {
        title: query,
        userId: user.id,
        completed: false,
      };

      addTodo(newTodo)
        .then(res => {
          setLoadingTodo(res.id);
          setTodos((prev) => [...prev, res]);
        })
        .catch(() => errorMsg('Unable to add a todo'))
        .finally(() => {
          setLoadingTodo(null);
          setQuery('');
        });
    }
  };

  const deleteTodo = useCallback((id: number) => {
    setLoadingTodo(id);
    setError(null);

    removeTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => errorMsg('Unable to delete a todo'))
      .finally(() => setLoadingTodo(null));
  }, [todos]);

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const handleComplite = useCallback((todoId: number, status: boolean) => {
    setLoadingTodo(todoId);
    const newCompleted = !status;

    changeComplete(todoId, { completed: newCompleted })
      .then((res: Todo) => {
        setTodos((prev) => (
          prev.map(item => (item.id === todoId ? res : item))
        ));
      })
      .catch(() => errorMsg('Unable to update a todo'))
      .finally(() => setLoadingTodo(null));
  }, []);

  const toggleAll = useCallback(async () => {
    setIsToggle(prev => !prev);

    const toggled = await Promise.all(
      todos.map(todo => {
        if (todo.completed !== isComplited) {
          setLoadingTodo(todo.id);
          handleComplite(todo.id, todo.completed);
        }

        return todo;
      }),
    );

    setTodos(toggled);

    setIsComplited(prev => !prev);
  }, [todos]);

  // const filteredTodos = useMemo((data: boolean) => {

  //     const arr = [...prev];

  //     return arr.filter(todo => todo.completed === data);

  // }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', { active: isToggle })}
            onClick={toggleAll}
          />

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  onChange={() => handleComplite(todo.id, todo.completed)}
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={
                  classNames(
                    'modal overlay', { 'is-active': loadingTodo === todo.id },
                  )
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">CSS</span>

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
          </div> */}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className="filter__link selected"
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className="filter__link"
                // onClick={() => filter(false)}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className="filter__link"
                // onClick={() => filter(true)}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />

        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        {error}
      </div>
    </div>
  );
};

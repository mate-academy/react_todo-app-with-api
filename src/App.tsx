/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputDataOfTodo, setInputDataOfTodo] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [sortType, setSortType] = useState(SortType.all);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res.map(todo => ({
          id: todo.id,
          userId: todo.userId,
          title: todo.title,
          completed: todo.completed,
        }))))
        .catch(e => `Error is ${e}`);
    }
  }, [isLoading]);

  const preparedTodosToShow = () => {
    switch (sortType) {
      case SortType.completed:
        return todos.filter(todo => todo.completed === true);

      case SortType.active:
        return todos.filter(todo => todo.completed === false);

      case SortType.all:
      default:
        return todos;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputDataOfTodo}
              onChange={(event) => {
                setInputDataOfTodo(event.target.value);
              }}
              onKeyUp={(event) => {
                if (event.key === 'Enter' && user && !!inputDataOfTodo) {
                  setNewTodo(inputDataOfTodo);
                  client.post<Todo>('/todos', {
                    title: newTodo,
                    userId: user.id,
                    completed: false,
                  })
                    .then(res => {
                      const todoFromServer: Todo = {
                        id: res.id,
                        userId: res.userId,
                        title: res.title,
                        completed: res.completed,
                      };

                      setTodos(prev => [...prev, todoFromServer]);
                    })
                    .catch(e => `error is ${e}`)
                    .finally(() => {
                      setNewTodo('');
                      setInputDataOfTodo('');
                    });
                }
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {preparedTodosToShow().map(todo => (
            <div
              data-cy="Todo"
              key={todo.id}
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                  onClick={() => {
                    setIsLoading(true);
                    client.patch<Todo>(`/todos/${todo.id}`, {
                      completed: !todo.completed,
                    })
                    // .then(res => {
                    //   const newTodo = todos.find(todoNew => (
                    //     todoNew.id === res.id));

                    // });
                      .finally(() => setIsLoading(false));
                  }}
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
                onClick={() => {
                  setIsLoading(false);
                  client.delete(`/todos/${todo.id}`)
                    .finally(() => setIsLoading(true));
                }}
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {/* <div data-cy="Todo" className="todo completed">
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

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link', { selected: sortType === SortType.all },
              )}
              onClick={() => setSortType(SortType.all)}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                'filter__link', { selected: sortType === SortType.active },
              )}
              onClick={() => setSortType(SortType.active)}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                'filter__link', { selected: sortType === SortType.completed },
              )}
              onClick={() => setSortType(SortType.completed)}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
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

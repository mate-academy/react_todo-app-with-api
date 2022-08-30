/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames/bind';
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  changeTodoStatus,
  changeTodoTitle,
  deleteTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

enum SortType {
  default,
  active,
  completed,
}

enum Error {
  noError,
  whenEmptyTitle,
  whenAddTodo,
  whenDeleteTodo,
  whenChangeStatus,
  whenChangeTitle,
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputtext] = useState('');
  // eslint-disable-next-line
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  // eslint-disable-next-line
  const [isDoubleClicked, setIsDoubleCliked] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>();
  const [todoInputText, setTodoInputText] = useState<string>('');
  const [currentSortType,
    setCurrentSortType] = useState<SortType>(SortType.default);
  // eslint-disable-next-line
  const [currentError, setCurrentError] = useState<Error>();

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((newTodos) => setTodos(newTodos));
    }
  }, [user]);

  const visibleTodos = useMemo(() => {
    switch (currentSortType) {
      case SortType.active:
        return todos.filter(todo => !todo.completed);
      case SortType.completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [currentSortType, todos]);

  const newTodoAddHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const id = Math.random();

    if (user) {
      const newTodo: Todo = {
        id,
        userId: user.id,
        title: inputText,
        completed: false,
      };

      setLoadingTodosId(prev => [...prev, id]);

      // console.log(newTodo);

      addTodo(newTodo)
        .then((returnedTodo: Todo) => {
          setTodos((currtodos) => currtodos.map(todo => {
            const prepTodo = { ...todo };

            if (prepTodo.id === id) {
              prepTodo.id = returnedTodo.id;
            }

            return prepTodo;
          }));
        })
        .catch(() => (
          setTodos(currTodos => currTodos.filter(todo => todo.id !== id))
        ));
    }
  };

  const changeTodoStatusHandler = (todo: Todo) => {
    changeTodoStatus(todo)
      .then((returnedTodo: Todo) => {
        setTodos((currtodos) => currtodos.map(currTodo => {
          const prepTodo = { ...currTodo };

          if (prepTodo.id === returnedTodo.id) {
            prepTodo.completed = returnedTodo.completed;
          }

          return prepTodo;
        }));
      })
      .catch(() => (
        setCurrentError(Error.whenChangeStatus)
      ));
  };

  const deleteTodoHandler = (todo: Todo) => {
    deleteTodo(todo)
      .then(() => {
        setTodos((currtodos) => currtodos.filter(currTodo => {
          if (currTodo.id === todo.id) {
            return false;
          }

          return true;
        }));
      })
      .catch(() => (
        setCurrentError(Error.whenDeleteTodo)
      ));
  };

  const changeTodoTitleHandler = (event: React.FormEvent, todo: Todo) => {
    event.preventDefault();
    if (todoInputText.length === 0) {
      deleteTodoHandler(todo);
    } else {
      changeTodoTitle(todo, todoInputText)
        .then((returnedTodo: Todo) => {
          setTodos((currTodos) => currTodos.map(currTodo => {
            const prepTodo = { ...currTodo };

            if (prepTodo.id === returnedTodo.id) {
              prepTodo.title = returnedTodo.title;
            }

            return prepTodo;
          }));
        })
        .catch(() => (
          setCurrentError(Error.whenChangeTitle)
        ))
        .finally(() => {
          setIsDoubleCliked(false);
          setSelectedTodoId(0);
          setTodoInputText('');
        });
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

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
            onSubmit={(event) => (newTodoAddHandler(event))}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={(event) => setInputtext(event.target.value)}
            />
          </form>
        </header>

        {todos && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
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
                    checked
                    onChange={() => (changeTodoStatusHandler(todo))}
                  />
                </label>
                {selectedTodoId === todo.id
                  ? (
                    <form onSubmit={(event) => (
                      changeTodoTitleHandler(event, todo))}
                    >
                      <input
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={todoInputText}
                        ref={newTodoField}
                        onChange={(event) => (
                          setTodoInputText(event.target.value)
                        )}
                      />
                    </form>
                  )
                  : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setIsDoubleCliked(true);
                        setSelectedTodoId(todo.id);
                        setTodoInputText(todo.title);
                      }}
                    >
                      {todo.title}
                    </span>
                  )}

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => (deleteTodoHandler(todo))}
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

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
            </div>
          </section>
        )}

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
              onClick={() => (setCurrentSortType(SortType.default))}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
              onClick={() => (setCurrentSortType(SortType.active))}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
              onClick={() => (setCurrentSortType(SortType.completed))}
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

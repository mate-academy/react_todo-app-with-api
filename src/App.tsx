/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { UserWarning } from './components/UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { ShowTodos } from './types/ShowTodos';
import { ShowError } from './types/ShowErrors';
import {
  USER_ID,
  todosFromServer,
  createTodoOnServer,
  deleteTodoOnServer,
  toggleTodoOnServer,
  updateTodoOnServer,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ShowError | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<ShowTodos>(ShowTodos.All);
  const [todoTitle, setTodoTitle] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const showErrors = (showError: ShowError) => {
    switch (showError) {
      case ShowError.fetchTodos:
        setError(ShowError.fetchTodos);
        break;
      case ShowError.createTodo:
        setError(ShowError.createTodo);
        break;
      case ShowError.addTodo:
        setError(ShowError.addTodo);
        break;
      case ShowError.deleteTodo:
        setError(ShowError.deleteTodo);
        break;
      case ShowError.updateTodo:
        setError(ShowError.updateTodo);
        break;

      default:
        break;
    }

    clearError();
  };

  const handleFilterSelect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    switch (event.currentTarget.textContent) {
      case 'Active':
        setSelectedTodos(ShowTodos.Active);
        break;
      case 'Completed':
        setSelectedTodos(ShowTodos.Completed);
        break;
      default:
        setSelectedTodos(ShowTodos.All);
        break;
    }
  };

  const getFilteredTodos = (showTodos: ShowTodos) => {
    switch (showTodos) {
      case ShowTodos.Active:
        return todos.filter(todo => !todo.completed);
      case ShowTodos.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  useEffect(() => {
    setError(null);
    todosFromServer
      .then(fetchedTodos => setTodos(fetchedTodos))
      .catch(() => showErrors(ShowError.fetchTodos));
  }, []);

  const filteredTodos = React.useMemo(() => {
    return getFilteredTodos(selectedTodos);
  }, [selectedTodos, todos]);

  const handleCreateTodo = (event: React.FormEvent) => {
    if (!todoTitle) {
      showErrors(ShowError.createTodo);
    }

    event.preventDefault();
    if (todoTitle) {
      setIsDisabled(true);
      setTempTodo({
        id: 0,
        title: '',
        userId: USER_ID,
        completed: false,
      });
      createTodoOnServer(todoTitle)
        .then(newTodo => setTodos([...todos, newTodo]))
        .catch(() => showErrors(ShowError.addTodo))
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
          setTodoTitle(null);
        });
    }
  };

  const updateTodo = (newTodo: Todo) => {
    setTempTodo({
      id: 0,
      title: '',
      userId: USER_ID,
      completed: false,
    });
    updateTodoOnServer(newTodo.id, newTodo.title)
      .then(() => setTodos(todos.map(todo => (
        (todo.id !== newTodo.id)
          ? todo
          : {
            ...todo,
            title: newTodo.title,
          }))))
      .catch(() => showErrors(ShowError.updateTodo))
      .finally(() => setTempTodo(null));
  };

  const deleteTodo = (todoId: number) => {
    setTempTodo({
      id: 0,
      title: '',
      userId: USER_ID,
      completed: false,
    });
    deleteTodoOnServer(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => showErrors(ShowError.deleteTodo))
      .finally(() => setTempTodo(null));
  };

  const toggleTodo = (todoId: number, completed: boolean) => {
    setTempTodo({
      id: 0,
      title: '',
      userId: USER_ID,
      completed: false,
    });
    toggleTodoOnServer(todoId, completed)
      .then(() => setTodos(todos.map(todo => (
        (todo.id !== todoId)
          ? todo
          : { ...todo, completed: !completed }))))
      .catch(() => showErrors(ShowError.updateTodo))
      .finally(() => setTempTodo(null));
  };

  const deleteComplitedTodos = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodoOnServer(todo.id)),
    )
      .then(() => setTodos(todos.filter(todo => !todo.completed)));
  };

  const toggleAllTodos = () => {
    Promise.all(
      todos.map(todo => toggleTodoOnServer(todo.id, todo.completed)),
    )
      .then(() => setTodos(todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }))));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            title="Toggle All"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: todos.every(todo => todo.completed),
              },
            )}
            onClick={toggleAllTodos}
          />

          <form onSubmit={handleCreateTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle ?? ''}
              disabled={isDisabled}
              onChange={(event) => setTodoTitle(event.target.value.trim())}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {/* <TransitionGroup> */}

          {filteredTodos
          && filteredTodos.length > 0
          && (
            <TodoList
              todos={filteredTodos}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
          )}

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <div className="todo">
                <label className="todo__status-label">
                  <input type="checkbox" className="todo__status" />
                </label>

                <span className="todo__title">Todo is being saved now</span>
                <button type="button" className="todo__remove">×</button>

                <div className="modal overlay is-active">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          )}
          {/* </TransitionGroup> */}
        </section>

        {filteredTodos
        && filteredTodos.length > 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {filteredTodos.length === 1
                ? `${filteredTodos.length} item left`
                : `${filteredTodos.length} items left`}
            </span>

            <Filter
              selectedTodos={selectedTodos}
              handleFilterSelect={handleFilterSelect}
            />

            {todos.filter(todo => todo.completed).length > 0
            && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={deleteComplitedTodos}
              >
                Clear completed
              </button>
            )}

          </footer>
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
      >
        <button
          type="button"
          title="delete"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};

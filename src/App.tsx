/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<Todo[]>([]);

  const focusField = useRef<HTMLInputElement>(null);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    postService
      .getTodos(postService.USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        handleError('Unable to load todos');

        return <UserWarning />;
      });
  }, []);

  useEffect(() => {
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [tempTodo]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty');

      return;
    }

    const currentTodo = {
      id: 0,
      title: trimmedTitle,
      userId: postService.USER_ID,
      completed: false,
    };

    setTempTodo(currentTodo);

    postService
      .addTodo(currentTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        handleError(`Unable to add a todo`);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setIsLoading([updatedTodo]);

    postService
      .updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos.findIndex(
            todoItem => todoItem.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todoFromServer);

          return newTodos;
        });
      })
      .catch(() => {
        handleError(`Unable to update a todo`);
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  const handleToggleAll = () => {
    let actualTodos = todos.filter(todo => !todo.completed);

    if (actualTodos.length === 0) {
      actualTodos = todos.map(todo => ({ ...todo, completed: false }));
    } else {
      actualTodos = actualTodos.map(todo => ({ ...todo, completed: true }));
    }

    for (let i = 0; i < actualTodos.length; i++) {
      handleUpdateTodo(actualTodos[i]);
    }
  };

  const deleteTodo = (todosForDelete: Todo[]) => {
    setIsLoading(todosForDelete);

    for (let i = 0; i < todosForDelete.length; i++) {
      const todoForDelete = {
        id: todosForDelete[i].id,
        title,
        userId: postService.USER_ID,
        completed: false,
      };

      setTempTodo(todoForDelete);

      postService
        .delTodo(todosForDelete[i].id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== todosForDelete[i].id),
          );
        })
        .catch(() => {
          handleError(`Unable to delete a todo`);
          setTempTodo(null);
          setIsLoading([]);

          return <UserWarning />;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const onDeleteCompletedTodos = () => {
    deleteTodo(completedTodos);
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              value={title}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={focusField}
              disabled={!!tempTodo}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoInfo
                  key={todo.id}
                  todoInfo={todo}
                  onDelete={deleteTodo}
                  todosForProcesing={isLoading}
                  onUpdate={handleUpdateTodo}
                />
              </CSSTransition>
            ))}

            {tempTodo?.id === 0 && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <NewTodo tempTitle={tempTodo.title} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === Filter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodos.length}
              data-cy="ClearCompletedButton"
              onClick={onDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem';

type Sort = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState<Sort>('All');
  const [title, setTitle] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempState, setTempState] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const activeTodo = [...todos].filter(todo => todo.completed === false);
  const completedTodo = [...todos].filter(todo => todo.completed === true);

  let filteredTodos = todos;

  if (sortBy === 'Active') {
    filteredTodos = activeTodo;
  }

  if (sortBy === 'Completed') {
    filteredTodos = completedTodo;
  }

  const handleDelete = (id: number) => {
    setLoadingIds([id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds([]);
        inputRef.current?.focus();
      });
  };
  //   const completedTodo: Todo[] = todos.map(todo => {
  //     if (todo.id === id) {
  //       setLoadingIds([...loadingIds, todo.id]);

  //       return {
  //         ...todo,
  //         completed: !todo.completed,
  //       };
  //     }

  //     setTimeout(() => {
  //       const loading = loadingIds.filter(item => {
  //         return item !== todo.id;
  //       });

  //       setLoadingIds(loading);
  //     }, 500);

  //     return todo;
  //   });

  //   setTodos(completedTodo);
  // };

  // console.log(handleCompltete);

  const handleToggleStatus = (todo: Todo) => {
    setLoadingIds([todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingIds([]));
  };

  const handleToggleAllStatus = () => {
    if (activeTodo.length > 0) {
      activeTodo.forEach(item => handleToggleStatus(item));
    } else {
      completedTodo.forEach(item => handleToggleStatus(item));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempState(tempTodo);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    postTodo(newTodo)
      .then((newTodoFromServer: Todo) => {
        setTodos(currentTodo => [...currentTodo, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        inputRef.current?.focus();

        setTempState(null);
      });
  };

  const handleRename = (todo: Todo) => {
    setLoadingIds([todo.id]);

    updateTodo(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingIds([]));
  };

  const handleDeleteCompleted = () => {
    const deletedIds = completedTodo.map(todo => todo.id);

    deletedIds.forEach(id => handleDelete(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length === completedTodo.length,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllStatus}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <TodoItem
                todo={todo}
                loadingIds={loadingIds}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onRename={handleRename}
                key={todo.id}
              />
            );
          })}
          {tempState && <TodoItem todo={tempState} loadingIds={[0]} />}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodo.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: sortBy === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setSortBy('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: sortBy === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSortBy('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: sortBy === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSortBy('Completed')}
              >
                Completed
              </a>
            </nav>

            {completedTodo.length === 0 ? (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled
              >
                Clear completed
              </button>
            ) : (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleDeleteCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};

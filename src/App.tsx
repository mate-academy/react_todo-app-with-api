/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 10876;

enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isTodoLoaded, setIsTodoLoaded] = useState<boolean>(false);

  const [deleteTodoIds, setDeleteTodoIds] = useState([0]);
  const [updatedTodoIds, setUpdatedTodoIds] = useState([0]);

  const [isTodoEditing, setIsTodoEditing] = useState<boolean>(false);
  const [todoEditing, setTodoEditing] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const handleErrorMessage = (message: string) => {
    setIsShowError(true);
    setError(message);

    setTimeout(() => {
      setIsShowError(false);
    }, 3000);
  };

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => setTodos(todosFromServer))
      .catch(() => setError('Unable to get todos'));
  }, []);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = {
    all: todos,
    active: activeTodos,
    completed: completedTodos,
  };

  const visibleTodos:Todo[] = filteredTodos[
    filterType as keyof typeof filteredTodos
  ];

  const handleFilterChange = (selectedFilter: Filter) => {
    setFilterType(selectedFilter);
  };

  const handleErrorDelete = () => setIsShowError(false);

  const addTodo = async (event: React.FormEvent, title: string) => {
    event.preventDefault();

    if (!title.trim()) {
      handleErrorMessage('Title can\'t be empty');
      setQuery('');

      return;
    }

    try {
      setIsTodoLoaded(true);

      const createdTodo = await postService.postTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      handleErrorMessage('Unable to add a todo');
    } finally {
      setIsTodoLoaded(false);
      setQuery('');
    }
  };

  const handleTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const deleteTodo = async (currentId: number) => {
    try {
      setDeleteTodoIds(prevIds => [...prevIds, currentId]);
      await postService.deleteTodo(currentId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== currentId));
    } catch {
      handleErrorMessage('Unable to delete a todo');
    }
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      setUpdatedTodoIds(prevIds => [...prevIds, updatedTodo.id]);

      await postService.updateTodo(updatedTodo);

      setTodos(prevTodos => {
        const newTodos = [...prevTodos];
        const index = newTodos.findIndex(
          todo => todo.id === updatedTodo.id,
        );

        newTodos.splice(index, 1, updatedTodo);

        return newTodos;
      });
    } catch {
      handleErrorMessage('Unable to update a todo');
    } finally {
      setUpdatedTodoIds([0]);
    }
  };

  const checkTodo = (selectedTodo: Todo, isCompleted?: boolean) => {
    updateTodo({
      ...selectedTodo,
      completed: isCompleted || !selectedTodo.completed,
    });
  };

  const handleToggleAll = () => {
    const allTodosCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if ((allTodosCompleted && todo.completed)
        || (!allTodosCompleted && !todo.completed)) {
        checkTodo(todo, !todo.completed);
      }
    });
  };

  const handleDoubleClick = (selectedTodo: Todo) => {
    setIsTodoEditing(true);
    setTodoEditing(selectedTodo);
    setNewTitle(selectedTodo.title);
  };

  const handleTodoUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const changeTodoTitle = (event: React.FormEvent, editedTitle: string) => {
    event.preventDefault();

    if (!todoEditing) {
      return;
    }

    if (!editedTitle) {
      deleteTodo(todoEditing.id);
    }

    if (editedTitle !== todoEditing.title) {
      updateTodo({
        ...todoEditing,
        title: editedTitle,
      });
    }

    setIsTodoEditing(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: activeTodos.length === 0,
            })}
            onClick={handleToggleAll}
          />

          <form onSubmit={(event) => addTodo(event, query)}>
            <input
              type="text"
              className={classNames(
                'todoapp__new-todo',
                { 'todoapp__new-todo__load': isTodoLoaded },
              )}
              placeholder="What needs to be done?"
              onChange={handleTodoInput}
              value={query}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main">
            {visibleTodos.map(todo => {
              const { id, title, completed } = todo;

              return (
                <div
                  className={classNames('todo', { completed })}
                  key={id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked={completed}
                      onClick={() => checkTodo(todo)}
                    />
                  </label>

                  {(isTodoEditing && todoEditing?.id === id) ? (
                    <form onSubmit={
                      (event) => changeTodoTitle(event, newTitle)
                    }
                    >
                      <input
                        type="text"
                        className="todo__title-field"
                        placeholder="Will be deleted if empty"
                        onChange={handleTodoUpdated}
                        value={newTitle}
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        className="todo__title"
                        onDoubleClick={() => handleDoubleClick(todo)}
                      >
                        {title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        onClick={() => deleteTodo(id)}
                      >
                        ×
                      </button>
                    </>
                  )}

                  <div className={classNames(
                    'modal',
                    'overlay',
                    {
                      'is-active':
                        deleteTodoIds.includes(id)
                        || updatedTodoIds.includes(id),
                    },
                  )}
                  >
                    <div className="
                      modal-background
                      has-background-white-ter
                      "
                    />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}

            {query && isTodoLoaded && (
              <div className="todo">
                <label className="todo__status-label">
                  <input type="checkbox" className="todo__status" />
                </label>

                <span className="todo__title">
                  Todo is being saved now
                </span>

                <div className="modal overlay is-active">
                  <div className="
                    modal-background
                    has-background-white-ter
                    "
                  />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} ${activeTodos.length > 1 ? 'items' : 'item'} left`}
            </span>

            <nav className="filter">
              <a
                role="button"
                href="#/"
                className={classNames(
                  'filter__link',
                  'filter__link__all',
                  { selected: filterType === Filter.ALL },
                )}
                onClick={() => handleFilterChange(Filter.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  'filter__link__active',
                  { selected: filterType === Filter.ACTIVE },
                )}
                onClick={() => handleFilterChange(Filter.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  'filter__link__completed',
                  { selected: filterType === Filter.COMPLETED },
                )}
                onClick={() => handleFilterChange(Filter.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                'clear-completed',
                { 'clear-completed__hide': completedTodos.length === 0 },
              )}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className="
          notification
          is-danger
          is-light
          has-text-weight-normal
        "
        hidden={!isShowError}
      >
        <button type="button" className="delete" onClick={handleErrorDelete} />
        {error}
      </div>
    </div>
  );
};

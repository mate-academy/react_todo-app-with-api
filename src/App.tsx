import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const editTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage(null);
      try {
        const userTodos = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(userTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (editingTodoId !== null && editTodoFieldRef.current) {
      editTodoFieldRef.current.focus();
    }
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'all':
      default:
        return true;
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage(null);
    setIsAddingTodo(true);

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);
    setLoadingTodoIds(currentIds => [...currentIds, tempTodo.id]);

    try {
      const newTodo = await client.post<Todo>('/todos', {
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === tempTodo.id ? newTodo : todo)),
      );
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== tempTodo.id),
      );
    } finally {
      setIsAddingTodo(false);
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => id !== tempTodo.id),
      );

      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));

      setTimeout(() => {
        if (newTodoFieldRef.current) {
          newTodoFieldRef.current.focus();
        }
      }, 0);
    }
  };

  const handleToggleTodoStatus = async (
    todoId: number,
    currentStatus: boolean,
  ) => {
    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todoId}`, {
        completed: !currentStatus,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const areAllTodosCompleted = todos.every(todo => todo.completed);
  const handleToggleAllTodos = async () => {
    setErrorMessage(null);
    const targetStatus = !areAllTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      const updatePromises = todosToUpdate.map(todo =>
        client.patch<Todo>(`/todos/${todo.id}`, { completed: targetStatus }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updated = updatedTodos.find(ut => ut.id === todo.id);

          return updated || todo;
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to update todos');
    } finally {
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage(null);

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodos.map(todo => todo.id),
    ]);

    const deletePromises = completedTodos.map(todo =>
      client.delete(`/todos/${todo.id}`).then(
        () => ({ status: 'fulfilled', todoId: todo.id }),
        () => ({ status: 'rejected', todoId: todo.id }),
      ),
    );

    const results = await Promise.all(deletePromises);

    const successfulDeletions = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.todoId);

    const failedDeletions = results
      .filter(result => result.status === 'rejected')
      .map(result => result.todoId);

    if (successfulDeletions.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );
    }

    if (failedDeletions.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setLoadingTodoIds(currentIds =>
      currentIds.filter(id => !completedTodos.some(todo => todo.id === id)),
    );

    setTimeout(() => {
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }, 0);
  };

  const handleUpdateTodoTitle = async (todo: Todo) => {
    setErrorMessage(null);
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedTitle === '') {
      setLoadingTodoIds(currentIds => [...currentIds, todo.id]);
      try {
        await client.delete(`/todos/${todo.id}`);
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        setEditingTodoId(null);
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      }

      return;
    }

    setLoadingTodoIds(currentIds => [...currentIds, todo.id]);

    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todo.id}`, {
        title: trimmedTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
      setEditingTodoId(null);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todo.id));
      if (editingTodoId === null) {
        setTimeout(() => {
          if (newTodoFieldRef.current) {
            newTodoFieldRef.current.focus();
          }
        }, 0);
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              ref={newTodoFieldRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <div
                data-cy="Todo"
                key={todo.id}
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() =>
                      handleToggleTodoStatus(todo.id, todo.completed)
                    }
                    disabled={loadingTodoIds.includes(todo.id)}
                  />
                </label>

                {editingTodoId === todo.id ? (
                  <form
                    onSubmit={event => {
                      event.preventDefault();
                      handleUpdateTodoTitle(todo);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      onBlur={() => handleUpdateTodoTitle(todo)}
                      onKeyUp={event => {
                        if (event.key === 'Escape') {
                          setEditingTodoId(null);
                        }
                      }}
                      ref={editTodoFieldRef}
                    />
                  </form>
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEditingTodoId(todo.id);
                      setEditedTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                )}

                {editingTodoId !== todo.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    ×
                  </button>
                )}
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loadingTodoIds.includes(todo.id) ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {
                todos.filter(
                  todo => !todo.completed && !loadingTodoIds.includes(todo.id),
                ).length
              }{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilterStatus('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={
                todos.filter(todo => todo.completed).length === 0 ||
                loadingTodoIds.length > 0
              }
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};

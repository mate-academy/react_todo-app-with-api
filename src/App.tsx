/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const [editTodo, setEditTodo] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const newTodoField = useRef<HTMLInputElement>(null);
  const editTodoField = useRef<HTMLInputElement>(null);

  const reset = () => {
    setError(null);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.UnableToLoadTodos);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const inputValue = newTodoField.current?.value.trim();

    if (!inputValue) {
      setError(ErrorMessage.TitleShouldNotBeEmpty);
      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    setIsInputDisabled(true);

    const newTodo: Todo = {
      id: 0,
      title: inputValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodos(newTodo)
      .then(createdTodo => {
        setTodos([...todos, createdTodo]);
        setTempTodo(null);
        if (newTodoField.current) {
          newTodoField.current.value = '';
        }
      })
      .catch(() => {
        setError(ErrorMessage.UnableToAddTodo);
        setTimeout(() => {
          setError('');
        }, 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);

        if (newTodoField.current) {
          newTodoField.current.focus();
        }
      });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos, error]);

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [editTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      case Filter.All:
      default:
        return true;
    }
  });

  const updateTodoStatus = (todoId: number) => {
    setEditTodo(null);
    setUpdatingTodosIds(prev => [...prev, todoId]);

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setUpdatingTodosIds(prev => prev.filter(id => id !== todoId));

      return;
    }

    updateTodos({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UnableToUpdateTodo);
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setUpdatingTodosIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodosIds(prev => [...prev, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setDeletingTodosIds(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.UnableToDeleteTodo);
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const handleCompletedDelete = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(id => {
      handleDeleteTodo(id);
    });
  };

  const handleUpdateAll = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);

    if (incompleteTodos.length > 0) {
      incompleteTodos.forEach(todo => {
        updateTodoStatus(todo.id);
      });
    } else {
      todos.forEach(todo => {
        updateTodoStatus(todo.id);
      });
    }
  };

  const handleRenameTodo = (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (todo) {
      setEditTodo(todoId);
      setEditingValue(todo.title);
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(event.target.value);
  };

  const handleTodoTitleBlur = () => {
    if (editTodo !== null) {
      const todo = todos.find(t => t.id === editTodo);

      if (todo && editingValue.trim() !== todo.title) {
        setUpdatingTodosIds(prev => [...prev, todo.id]);
        if (editingValue.trim() === '') {
          handleDeleteTodo(todo.id);
        } else {
          updateTodos({ ...todo, title: editingValue.trim() })
            .then(() => {
              setTodos(
                todos.map(t =>
                  t.id === todo.id ? { ...t, title: editingValue.trim() } : t,
                ),
              );
              setEditTodo(null);
              setEditingValue('');
            })
            .catch(() => {
              setError(ErrorMessage.UnableToUpdateTodo);
              setTimeout(() => {
                setError('');
              }, 3000);
            })
            .finally(() => {
              setUpdatingTodosIds(prev => prev.filter(id => id !== todo.id));
            });
        }
      } else {
        setEditTodo(null);
        setEditingValue('');
      }
    }
  };

  const handleTodoTitleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditTodo(null);
      setEditingValue('');
    } else if (event.key === 'Enter') {
      handleTodoTitleBlur();
    }
  };

  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: areAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleUpdateAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputDisabled}
              onChange={reset}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              onDoubleClick={() => {
                handleRenameTodo(todo.id);
              }}
            >
              {editTodo === todo.id ? (
                <>
                  <label
                    className="todo__status-label"
                    htmlFor={`todo-${todo.id}`}
                  >
                    <input
                      id={`todo-${todo.id}`}
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => updateTodoStatus(todo.id)}
                    />
                  </label>
                  <input
                    data-cy="TodoTitleField"
                    className="todo__title-field"
                    ref={editTodoField}
                    type="text"
                    value={editingValue}
                    onChange={handleEditChange}
                    onBlur={handleTodoTitleBlur}
                    onKeyUp={handleTodoTitleKeyUp}
                  />
                </>
              ) : (
                <>
                  <label
                    className="todo__status-label"
                    htmlFor={`todo-${todo.id}`}
                  >
                    <input
                      id={`todo-${todo.id}`}
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => updateTodoStatus(todo.id)}
                    />
                  </label>
                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active':
                    todos.length > 0 &&
                    (deletingTodosIds.includes(todo.id) ||
                      updatingTodosIds.includes(todo.id)),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label
                className="todo__status-label"
                htmlFor={`todo-${tempTodo.id}`}
              >
                <input
                  id={`todo-${tempTodo.id}`}
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  disabled
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': tempTodo,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.values(Filter).map(status => (
                <a
                  key={status}
                  href={`#/${status}`}
                  className={cn('filter__link', {
                    selected: status === filterStatus,
                  })}
                  data-cy={`FilterLink${status}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={handleCompletedDelete}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
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
        {error}
      </div>
    </div>
  );
};

/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todos';
import { Filter } from './types/FilterEnum';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosIds, setTodosIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [editTodo, setEditingTodo] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const inputField = useRef<HTMLInputElement>(null);
  const editingField = useRef<HTMLInputElement>(null);

  const reset = () => {
    setError(null);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const inputValue = inputField.current?.value.trim();

    if (!inputValue) {
      setError('Title should not be empty');
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

    addTodos(newTodo)
      .then(createdTodo => {
        setTodos([...todos, createdTodo]);
        setTempTodo(null);
        if (inputField.current) {
          inputField.current.value = '';
        }
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);

        if (inputField.current) {
          inputField.current.focus();
        }
      });
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todos, error]);

  useEffect(() => {
    if (editingField.current) {
      editingField.current.focus();
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
    setEditingTodo(null);
    setTodosIds(prev => [...prev, todoId]);

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setTodosIds(prev => prev.filter(id => id !== todoId));

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
        setError('Unable to update a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setTodosIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodosIds(prev => [...prev, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setTodosIds(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
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
      setEditingTodo(todoId);
      setEditingValue(todo.title);
    }
  };

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(event.target.value);
  };

  const handleTodoTitleBlur = () => {
    if (editTodo !== null) {
      const todo = todos.find(t => t.id === editTodo);

      if (todo && editingValue.trim() !== todo.title) {
        setTodosIds(prev => [...prev, todo.id]);
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
              setEditingTodo(null);
              setEditingValue('');
            })
            .catch(() => {
              setError('Unable to update a todo');
              setTimeout(() => {
                setError('');
              }, 3000);
            })
            .finally(() => {
              setTodosIds(prev => prev.filter(id => id !== todo.id));
            });
        }
      } else {
        setEditingTodo(null);
        setEditingValue('');
      }
    }
  };

  const handleTodoTitleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setEditingValue('');
    } else if (event.key === 'Enter') {
      handleTodoTitleBlur();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleUpdateAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputField}
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
                    ref={editingField}
                    type="text"
                    value={editingValue}
                    onChange={handleEditTitle}
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
                  'is-active': todos.length > 0 && todosIds.includes(todo.id),
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

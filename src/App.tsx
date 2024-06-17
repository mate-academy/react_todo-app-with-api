/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { LinkMode } from './types/LinkMode';
import { EditingItem } from './types/EditingItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function getVisibleTodos(todos: Todo[], link: LinkMode) {
  switch (link) {
    case LinkMode.active:
      return todos.filter(todo => !todo.completed);

    case LinkMode.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

function getTodosCount(todos: Todo[]) {
  const all = todos.length;
  const active = todos.reduce(
    (sum, todo) => (todo.completed ? sum : sum + 1),
    0,
  );
  const completed = all - active;

  return { all, active, completed };
}

function getComplitedTodos(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}

function verifyTitle(title: string) {
  return title.trim() !== '';
}

function deleteItemFromArray(array: number[], item: number) {
  const rest = [...array];
  const index = rest.indexOf(item);

  rest.splice(index, 1);

  return rest;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosCount = getTodosCount(todos);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeLink, setActiveLink] = useState(LinkMode.all);
  const [title, setTitle] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem>({
    selectedTodo: null,
    editedTitle: '',
  });

  const startEditing = (todo: Todo) => {
    setEditingItem({ selectedTodo: todo, editedTitle: todo.title });
  };

  const stopEditing = () => {
    setEditingItem({ selectedTodo: null, editedTitle: '' });
  };

  const updateEditingTitle = (editedTitle: string) => {
    setEditingItem(prev => ({ ...prev, editedTitle }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const timerId = useRef(0);

  function focusInput() {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }

  const handleErrorMessage = (errorText: string) => {
    setErrorMessage(errorText);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  const deleteTodo = (id: number) => {
    setDeletingTodoIds(ids => [...ids, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(ids => {
          return deleteItemFromArray(ids, id);
        });

        focusInput();
      });
  };

  const addTodo = () => {
    const newTodo = {
      title: title.trim(),
      userId: todoService.USER_ID,
      completed: false,
    };

    setIsSaving(true);

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    todoService
      .addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        handleErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSaving(false);
        setTempTodo(null);

        focusInput();
      });
  };

  const updateTodo = (todo: Todo) => {
    setUpdatingTodoIds(ids => [...ids, todo.id]);

    todoService
      .updateTodo({ ...todo })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo => {
            if (prevTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return prevTodo;
          }),
        );
        stopEditing();
        focusInput();
      })
      .catch(() => {
        handleErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(ids => {
          return deleteItemFromArray(ids, todo.id);
        });
      });
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const { editedTitle, selectedTodo } = editingItem;

    if (selectedTodo) {
      const isValidTitle = verifyTitle(editedTitle);

      if (!isValidTitle) {
        deleteTodo(selectedTodo.id);

        return;
      }

      if (editedTitle === selectedTodo.title) {
        stopEditing();

        return;
      }

      updateTodo({ ...selectedTodo, title: editedTitle.trim() });
    }
  };

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isValidTitle = verifyTitle(title);

    if (!isValidTitle) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    addTodo();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && editingItem.selectedTodo) {
      stopEditing();
    }
  };

  const changeActiveLink = (link: LinkMode) => {
    setActiveLink(link);
  };

  useEffect(() => {
    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage('Unable to load todos'));

    inputRef.current?.focus();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosCount.all > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todosCount.all === todosCount.completed,
              })}
              data-cy="ToggleAllButton"
              onClick={() => {
                if (
                  todosCount.all === todosCount.completed ||
                  todosCount.all === todosCount.active
                ) {
                  todos.forEach(todo =>
                    updateTodo({ ...todo, completed: !todo.completed }),
                  );
                } else {
                  const activeTodos = todos.filter(todo => !todo.completed);

                  activeTodos.forEach(todo =>
                    updateTodo({ ...todo, completed: !todo.completed }),
                  );
                }
              }}
            />
          )}

          <form onSubmit={handleAddSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {getVisibleTodos(todos, activeLink)?.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <div
                  data-cy="Todo"
                  className={cn('todo', { completed: todo.completed })}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() =>
                        updateTodo({ ...todo, completed: !todo.completed })
                      }
                    />
                  </label>

                  {editingItem.selectedTodo?.id === todo.id ? (
                    <form onSubmit={handleUpdateSubmit}>
                      <input
                        autoFocus
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={editingItem.editedTitle}
                        onChange={event => {
                          updateEditingTitle(event.target.value);
                        }}
                        onBlur={event => {
                          handleUpdateSubmit(event);
                        }}
                        onKeyUp={handleKeyUp}
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => {
                          startEditing(todo);
                        }}
                      >
                        {todo.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        ×
                      </button>
                    </>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active':
                        deletingTodoIds.includes(todo.id) ||
                        updatingTodoIds.includes(todo.id),
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={300}
                classNames="temp-item"
              >
                <div data-cy="Todo" className={cn('todo')} key={tempTodo.id}>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active': isSaving && tempTodo,
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todosCount.all > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${[todosCount.active]} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.entries(LinkMode).map(entry => {
                const [name, link] = entry;
                const capitalizeName = name[0].toUpperCase() + name.slice(1);

                return (
                  <a
                    href={`#/${link}`}
                    className={cn('filter__link', {
                      selected: activeLink === link,
                    })}
                    data-cy={`FilterLink${capitalizeName}`}
                    key={link}
                    onClick={() => changeActiveLink(link)}
                  >
                    {capitalizeName}
                  </a>
                );
              })}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todosCount.all === todosCount.active}
              onClick={() => {
                const complitedTodos = getComplitedTodos(todos);

                complitedTodos.forEach(todo => deleteTodo(todo.id));
              }}
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
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

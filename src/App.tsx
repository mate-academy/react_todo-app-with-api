import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  changeTodo, createTodo, getTodos, removeTodo,
} from './api/todos';
import { Notifications } from './types/Notifications';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notification, setNotification] = useState<Notifications | ''>('');
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodoTitle, setTemporaryTodoTitle] = useState('');
  const [isRenamingTodoID, setIsRenamingTodoID] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      if (user) {
        const loadedTodos = await getTodos(user.id);

        setTodos(loadedTodos);
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isRenamingTodoID]);

  const addLoader = (todoId: number) => {
    setLoadingTodos(current => ([...current, todoId]));
  };

  const removeLoader = (todoId: number) => {
    setLoadingTodos(current => [...current].filter(id => id !== todoId));
  };

  const createNotification = (message: Notifications) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const filterTodos = (option: Filter) => {
    switch (option) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      setTemporaryTodoTitle(title);
      setTitle('');
      const response = await createTodo(newTodo);
      const responseTodo = JSON.parse(JSON.stringify(response));

      const createdTodo = {
        id: responseTodo.id,
        userId: responseTodo.userId,
        title: responseTodo.title,
        completed: responseTodo.completed,
      };

      setTodos(currentTodos => ([...currentTodos, createdTodo]));
      setTemporaryTodoTitle('');
    } catch (e) {
      createNotification('Unable to add a todo');
    }

    setIsAdding(false);
  };

  const onDelete = async (todoId: number) => {
    addLoader(todoId);

    try {
      await removeTodo(todoId);
      removeLoader(todoId);
      setTodos(
        currentTodo => ([...currentTodo.filter(todo => todo.id !== todoId)]),
      );
    } catch (e) {
      createNotification('Unable to delete a todo');
      removeLoader(todoId);
    }
  };

  const updateTodoStatus = (todoId: number, value: boolean) => {
    setTodos(currentTodos => {
      return currentTodos.map(currentTodo => {
        if (currentTodo.id === todoId) {
          return {
            ...currentTodo,
            completed: value,
          };
        }

        return currentTodo;
      });
    });
  };

  const requestOnChange = async (todo: Todo, requestValue: boolean) => {
    addLoader(todo.id);

    try {
      await changeTodo(todo.id, { completed: requestValue });
      removeLoader(todo.id);
      updateTodoStatus(todo.id, requestValue);
    } catch (e) {
      removeLoader(todo.id);
      createNotification('Unable to update a todo');
    }
  };

  const completeTodo = async (todo: Todo) => {
    if (todo.completed) {
      await requestOnChange(todo, false);
    } else {
      await requestOnChange(todo, true);
    }
  };

  const clearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => onDelete(todo.id));
  };

  const toggleAll = () => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    if (uncompletedTodos.length !== todos.length) {
      uncompletedTodos.forEach(todo => requestOnChange(todo, true));
    } else {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => requestOnChange(todo, false));
    }
  };

  const handleSubmitNewTodoField = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotification('');
    setIsAdding(true);

    if (!title) {
      createNotification('Title can\'t be empty');
      setIsAdding(false);

      return;
    }

    const newTodo = {
      userId: user ? user.id : 0,
      title,
      completed: false,
    };

    addTodo(newTodo);
  };

  const showTitleField = (todo: Todo) => {
    setIsRenamingTodoID(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleSubmitTodoTitleField = async (
    todo: Todo, event: React.FormEvent,
  ) => {
    event.preventDefault();
    addLoader(todo.id);
    setIsRenamingTodoID(null);

    if (!newTodoTitle) {
      onDelete(todo.id);

      return;
    }

    if (todo.title !== newTodoTitle) {
      try {
        await changeTodo(todo.id, { title: newTodoTitle });
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === todo.id) {
              return {
                ...currentTodo,
                title: newTodoTitle,
              };
            }

            return currentTodo;
          });
        });
        removeLoader(todo.id);
      } catch (e) {
        createNotification('Unable to update a todo');
      }
    }

    removeLoader(todo.id);
  };

  const cancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsRenamingTodoID(null);
    }
  };

  const filteredTodos = filterTodos(filterType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            aria-label="toggle-all-todos"
            onClick={toggleAll}
          />

          <form onSubmit={handleSubmitNewTodoField}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TransitionGroup>
                {filteredTodos.map(todo => (
                  <CSSTransition
                    key={todo.id}
                    timeout={300}
                    classNames="item"
                  >
                    <div
                      data-cy="Todo"
                      className={classNames(
                        'todo',
                        {
                          completed: todo.completed,
                        },
                      )}
                      key={todo.id}
                    >
                      <label className="todo__status-label">
                        <input
                          data-cy="TodoStatus"
                          type="checkbox"
                          className="todo__status"
                          defaultChecked
                          onClick={() => completeTodo(todo)}
                        />
                      </label>
                      {isRenamingTodoID === todo.id
                        ? (
                          <form
                            onSubmit={
                              (event) => handleSubmitTodoTitleField(todo, event)
                            }
                          >
                            <input
                              data-cy="TodoTitleField"
                              type="text"
                              value={newTodoTitle}
                              onChange={
                                event => setNewTodoTitle(event.target.value)
                              }
                              className="todo__title-field"
                              onBlur={
                                (
                                  event,
                                ) => handleSubmitTodoTitleField(todo, event)
                              }
                              onKeyDown={cancelEditing}
                              ref={todoTitleField}
                            />
                          </form>
                        )
                        : (
                          <>
                            <span
                              data-cy="TodoTitle"
                              className="todo__title"
                              onDoubleClick={() => showTitleField(todo)}
                            >
                              {todo.title}
                            </span>
                            <button
                              type="button"
                              className="todo__remove"
                              data-cy="TodoDeleteButton"
                              onClick={() => onDelete(todo.id)}
                            >
                              ×
                            </button>
                          </>
                        )}

                      <div
                        data-cy="TodoLoader"
                        className={classNames(
                          'modal overlay',
                          {
                            'is-active': loadingTodos.includes(todo.id),
                          },
                        )}
                      >
                        <div
                          className="modal-background has-background-white-ter"
                        />
                        <div className="loader" />
                      </div>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {isAdding && (
                <div
                  data-cy="Todo"
                  className="todo"
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                    />
                  </label>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                  >
                    {temporaryTodoTitle}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todos.filter(todo => !todo.completed).length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.All },
                  )}
                  onClick={() => setFilterType(Filter.All)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.Active },
                  )}
                  onClick={() => setFilterType(Filter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterType === Filter.Completed },
                  )}
                  onClick={() => setFilterType(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={todos.filter(todo => todo.completed).length === 0}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
      {notification && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !notification },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="hide-notification"
            onClick={() => setNotification('')}
          />

          {notification}
        </div>
      )}
    </div>
  );
};

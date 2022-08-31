/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  addTodo,
  changeComplete,
  changeTitle,
  getTodos,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

enum ErrorType {
  AddTodo,
  DeleteTodo,
  UpdateTodo,
  Empty,
}

const Error = [
  { type: ErrorType.AddTodo, text: 'Unable to add a todo' },
  { type: ErrorType.DeleteTodo, text: 'Unable to delete a todo' },
  { type: ErrorType.UpdateTodo, text: 'Unable to update a todo' },
  { type: ErrorType.Empty, text: "Title can't be empty" },
];

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC<{}> = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const todoTitleField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadTodoIds, setLoadTodoIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isToggle, setIsToggle] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  // const [isComplited, setIsComplited] = useState([]);
  // const [visibleTodos, setVisibleTodos] = useState(todos);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(res => setTodos(res));
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [editingValue, todoTitleField]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(null);
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const errorMsg = useCallback((type: ErrorType) => {
    const erObj = Error.find(er => er.type === type);

    if (erObj) {
      setError(erObj.text);
    }

    setTimeout(() => setError(null), 3000);
  }, []);

  const handleSubmit = () => {
    setError(null);
    setIsAdding(false);

    if (query === '') {
      errorMsg(ErrorType.Empty);

      return;
    }

    if (user) {
      const newTodo = {
        title: query,
        userId: user.id,
        completed: false,
      };

      addTodo(newTodo)
        .then(res => {
          setLoadTodoIds(prev => [...prev, res.id]);
          setTodos((prev) => [...prev, res]);
        })
        .catch(() => errorMsg(ErrorType.AddTodo))
        .finally(() => {
          setLoadTodoIds(prev => {
            return prev.slice(0, -1);
          });
          setQuery('');
          setIsAdding(true);
        });
    }
  };

  const deleteTodo = useCallback((id: number) => {
    setLoadTodoIds(prev => [...prev, id]);
    setError(null);

    removeTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => errorMsg(ErrorType.DeleteTodo))
      .finally(() => (
        setLoadTodoIds(prev => prev.filter(todoId => todoId !== id))
      ));
  }, [todos]);

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const handleComplite = useCallback((todoId: number, status: boolean) => {
    setError(null);
    setLoadTodoIds(prev => [...prev, todoId]);
    const newCompleted = !status;

    changeComplete(todoId, { completed: newCompleted })
      .then((res: Todo) => {
        setTodos((prev) => (
          prev.map(item => (item.id === todoId ? res : item))
        ));
      })
      .catch(() => errorMsg(ErrorType.UpdateTodo))
      .finally(() => setLoadTodoIds(
        prev => prev.filter(id => todoId !== id),
      ));
  }, []);

  const toggleAll = useCallback(async () => {
    const toggled = await Promise.all(
      todos.map(todo => {
        if (todo.completed === isToggle) {
          setLoadTodoIds(prev => [...prev, todo.id]);
          handleComplite(todo.id, todo.completed);
        }

        return todo;
      }),
    );

    setTodos(toggled);
    setIsToggle(prev => !prev);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => todo.completed === false);

      case 'completed':
        return todos.filter(todo => todo.completed === true);

      default:
        return [...todos];
    }
  }, [filterType, todos]);

  const onEditing = useCallback((id: number) => {
    setError(null);
    const task = todos.find(todo => todo.id === id);

    if (task?.title === editingValue) {
      setIsEditing(null);
      setLoadTodoIds(
        prev => prev.filter(todoId => todoId !== id),
      );

      return;
    }

    if (editingValue === '') {
      deleteTodo(id);

      return;
    }

    setLoadTodoIds(prev => [...prev, id]);

    changeTitle(id, { title: editingValue })
      .then((res: Todo) => {
        setTodos((prev) => (
          prev.map(item => (item.id === id ? res : item))
        ));
      })
      .catch(() => errorMsg(ErrorType.UpdateTodo))
      .finally(() => {
        setIsEditing(null);
        setLoadTodoIds(
          prev => prev.filter(todoId => todoId !== id),
        );
      });
  }, [todos, editingValue]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', { active: isToggle })}
            onClick={toggleAll}
          />

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!isAdding}
            />
          </form>
        </header>

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
                  onChange={() => handleComplite(todo.id, todo.completed)}
                />
              </label>

              {isEditing === todo.id
                ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onEditing(todo.id);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      ref={todoTitleField}
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.currentTarget.value)}
                      onBlur={() => onEditing(todo.id)}
                    />
                  </form>
                )
                : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setIsEditing(todo.id);
                        setEditingValue(todo.title);
                      }}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDeleteButton"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

              <div
                data-cy="TodoLoader"
                className={
                  classNames(
                    'modal overlay', {
                      'is-active': loadTodoIds.includes(todo.id),
                    },
                  )
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link', { selected: filterType === 'all' },
                )}
                onClick={() => setFilterType('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link', { selected: filterType === 'active' },
                )}
                onClick={() => setFilterType('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link', { selected: filterType === 'completed' },
                )}
                onClick={() => setFilterType('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
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

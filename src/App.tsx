/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

type Filter = (typeof FILTERS)[keyof typeof FILTERS];

type NewTodoFormProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  onAdd: () => void;
  disabled: boolean;
};

const NewTodoForm: React.FC<NewTodoFormProps> = ({
  inputRef,
  onAdd,
  disabled,
}) => (
  <form>
    <input
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      autoFocus
      ref={inputRef}
      disabled={disabled}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onAdd();
        }
      }}
    />
  </form>
);

type TodoItemProps = {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editValue: string;
  editInputRef?: React.RefObject<HTMLInputElement>;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
  onStartEdit?: (id: number, title: string) => void;
  onEditChange?: (value: string) => void;
  onSaveEdit?: (id: number, currentTitle: string) => void;
  onCancelEdit?: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  isEditing,
  editValue,
  editInputRef,
  onDelete,
  onToggle,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const isCancelledByEscRef = useRef(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={!onToggle}
          onChange={() => onToggle?.(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            onSaveEdit?.(todo.id, todo.title);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editInputRef}
            autoFocus
            value={editValue}
            onChange={event => onEditChange?.(event.target.value)}
            onBlur={() => {
              if (isCancelledByEscRef.current) {
                isCancelledByEscRef.current = false;

                return;
              }

              onSaveEdit?.(todo.id, todo.title);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                isCancelledByEscRef.current = true;
                onCancelEdit?.();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onStartEdit?.(todo.id, todo.title)}
          >
            {todo.title}
          </span>

          {onDelete && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

type TodoListProps = {
  todos: Todo[];
  processingIds: number[];
  tempTodo: Todo | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  editingId: number | null;
  editValue: string;
  onStartEdit: (id: number, title: string) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: (id: number, currentTitle: string) => void;
  onCancelEdit: () => void;
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  processingIds,
  tempTodo,
  editInputRef,
  onDelete,
  onToggle,
  editingId,
  editValue,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={processingIds.includes(todo.id)}
        isEditing={editingId === todo.id}
        editValue={editValue}
        editInputRef={editingId === todo.id ? editInputRef : undefined}
        onDelete={onDelete}
        onToggle={onToggle}
        onStartEdit={onStartEdit}
        onEditChange={onEditChange}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
      />
    ))}

    {tempTodo && (
      <TodoItem todo={tempTodo} isLoading isEditing={false} editValue="" />
    )}
  </section>
);

type TodoFooterProps = {
  activeTodosCount: number;
  filter: Filter;
  onFilterChange: (filterValue: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FILTERS.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FILTERS.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FILTERS.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(FILTERS.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FILTERS.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(FILTERS.completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(FILTERS.all);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));

    inputRef.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos.length > 0;
  const hasCompleted = todos.some(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const areAllCompleted = hasTodos && todos.every(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const addNewTodo = async () => {
    setErrorMessage('');

    const value = inputRef.current?.value.trim();

    if (!value) {
      setErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const creatingTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    };

    setTempTodo(creatingTodo);
    setIsAdding(true);

    try {
      const savedTodo = await addTodo({
        userId: USER_ID,
        title: value,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, savedTodo]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const removeTodo = async (id: number) => {
    setErrorMessage('');
    setProcessingIds(prevIds => Array.from(new Set([...prevIds, id])));

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingIds(prevIds =>
        prevIds.filter(processingId => processingId !== id),
      );
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    setErrorMessage('');
    setProcessingIds(prevIds => Array.from(new Set([...prevIds, id])));

    try {
      const updated = await updateTodo(id, { completed: !completed });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updated : todo)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingIds(prevIds =>
        prevIds.filter(processingId => processingId !== id),
      );
    }
  };

  const clearCompleted = async () => {
    setErrorMessage('');

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(prevIds =>
      Array.from(new Set([...prevIds, ...completedIds])),
    );

    const deleteResults = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const failedIds = completedIds.filter(
      (_, index) => deleteResults[index].status === 'rejected',
    );

    setTodos(prevTodos =>
      prevTodos.filter(todo => {
        if (!todo.completed) {
          return true;
        }

        return failedIds.includes(todo.id);
      }),
    );

    if (failedIds.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setProcessingIds(prevIds =>
      prevIds.filter(processingId => !completedIds.includes(processingId)),
    );
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const toggleAll = async () => {
    if (!hasTodos) {
      return;
    }

    setErrorMessage('');

    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(prevIds =>
      Array.from(new Set([...prevIds, ...idsToUpdate])),
    );

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !areAllCompleted }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(
          todo => updatedTodos.find(updated => updated.id === todo.id) ?? todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingIds(prevIds =>
        prevIds.filter(processingId => !idsToUpdate.includes(processingId)),
      );
    }
  };

  const startEditing = (id: number, title: string) => {
    setEditingId(id);
    setEditValue(title);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = async (id: number, currentTitle: string) => {
    if (processingIds.includes(id)) {
      return;
    }

    const trimmedTitle = editValue.trim();

    if (trimmedTitle === currentTitle) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      await removeTodo(id);

      return;
    }

    setErrorMessage('');
    setProcessingIds(prevIds => Array.from(new Set([...prevIds, id])));

    try {
      const updated = await updateTodo(id, { title: trimmedTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updated : todo)),
      );
      setEditingId(null);
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => editInputRef.current?.focus(), 0);
    } finally {
      setProcessingIds(prevIds =>
        prevIds.filter(processingId => processingId !== id),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <NewTodoForm
            inputRef={inputRef}
            onAdd={addNewTodo}
            disabled={isAdding}
          />
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            processingIds={processingIds}
            tempTodo={tempTodo}
            editInputRef={editInputRef}
            onDelete={removeTodo}
            onToggle={toggleTodo}
            editingId={editingId}
            editValue={editValue}
            onStartEdit={startEditing}
            onEditChange={setEditValue}
            onSaveEdit={saveEditing}
            onCancelEdit={cancelEditing}
          />
        )}

        {hasTodos && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
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

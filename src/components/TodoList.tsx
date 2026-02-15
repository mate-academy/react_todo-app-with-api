import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  processingIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

type TodoRowProps = {
  todo: Todo;
  isProcessing: boolean;
  isEditing: boolean;
  editedTitle: string;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: Todo) => void;
  onStartEditing?: (todo: Todo) => void;
  onTitleChange?: (title: string) => void;
  onCancelEditing?: () => void;
  onSubmitEditing?: (todo: Todo) => void;
};

const TodoRow: React.FC<TodoRowProps> = ({
  todo,
  isProcessing,
  isEditing,
  editedTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onTitleChange,
  onCancelEditing,
  onSubmitEditing,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmitEditing?.(todo);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div
        className="todo__status-label"
        onClick={() => {
          if (!isProcessing) {
            onToggle?.(todo);
          }
        }}
      >
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          readOnly
          disabled={isProcessing}
        />
      </div>

      {!isEditing && (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => onStartEditing?.(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
            disabled={isProcessing}
          >
            x
          </button>
        </>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editedTitle}
            onChange={event => onTitleChange?.(event.target.value)}
            onBlur={() => onSubmitEditing?.(todo)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                onCancelEditing?.();
              }
            }}
            disabled={isProcessing}
            autoFocus
          />
        </form>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  tempTodo,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const submittingTodoIdRef = useRef<number | null>(null);

  const isEditing = (todoId: number) => editingTodoId === todoId;

  const startEditing = (todo: Todo) => {
    if (processingIds.includes(todo.id)) {
      return;
    }

    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTitle('');
  };

  const submitEditing = async (todo: Todo) => {
    if (!isEditing(todo.id)) {
      return;
    }

    if (submittingTodoIdRef.current === todo.id) {
      return;
    }

    if (editedTitle.trim() === todo.title) {
      cancelEditing();

      return;
    }

    submittingTodoIdRef.current = todo.id;

    try {
      await onRename(todo, editedTitle);
      cancelEditing();
    } catch {
      // Keep form open so user can fix or retry after API error.
    } finally {
      submittingTodoIdRef.current = null;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoRow
              todo={todo}
              isProcessing={processingIds.includes(todo.id)}
              isEditing={isEditing(todo.id)}
              editedTitle={isEditing(todo.id) ? editedTitle : todo.title}
              onDelete={onDelete}
              onToggle={onToggle}
              onStartEditing={startEditing}
              onTitleChange={setEditedTitle}
              onCancelEditing={cancelEditing}
              onSubmitEditing={submitEditing}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoRow
              todo={tempTodo}
              isProcessing
              isEditing={false}
              editedTitle={tempTodo.title}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

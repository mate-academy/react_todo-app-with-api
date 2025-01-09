import classNames from 'classnames';

import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type TodoItemProps = {
  onDeleteTodo: (id: number) => void;
  todo: Todo;
  isLoadingChange: boolean;
  deleteTodoId: number | null;
  cleanCompleted: boolean;
  isAdding?: boolean;
  onUpdateTodo: (id: number) => void;
  isUpdating?: number[] | null;
  setIsUpdating: React.Dispatch<React.SetStateAction<number[] | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDeleteTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export function TodoItem({
  todo,
  onDeleteTodo,
  isLoadingChange,
  deleteTodoId,
  cleanCompleted,
  isAdding,
  onUpdateTodo,
  isUpdating,
  setIsUpdating,
  setErrorMessage,
  setTodos,
  setDeleteTodoId,
}: TodoItemProps) {
  const [itemEditingId, setItemEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleUpadateNewTitle(id: number, title: string) {
    if (todo?.title === title) {
      setItemEditingId(null);

      return;
    }

    if (title.trim() === '') {
      setDeleteTodoId(id);
      setIsUpdating([id]);

      return;
    }

    if (title) {
      if (!isUpdating) {
        setIsUpdating([id]);
      }

      setErrorMessage(null);

      const updatedTitle = { title: title.trim() };

      updateTodo(id, updatedTitle)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.map(item =>
              item.id === id ? { ...item, title: updatedTitle.title } : item,
            ),
          );

          setItemEditingId(null);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setItemEditingId(id);
          setNewTitle(title);
          inputRef.current?.focus();
        })
        .finally(() => {
          setIsUpdating(null);
        });
    }
  }

  function handleCancel(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setItemEditingId(null);
      setNewTitle(todo.title);
    }
  }

  useEffect(() => {
    if (itemEditingId === todo.id && inputRef.current) {
      inputRef.current.focus();
      setNewTitle(todo.title);
    }
  }, [itemEditingId, todo.id, todo.title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor={`${todo.id}`} className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdateTodo(todo.id)}
        />
      </label>

      {itemEditingId !== todo.id && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setItemEditingId(todo.id)}
          >
            {todo.title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* This todo is being edited */}

      {/* This form is shown instead of the title and remove button */}
      {itemEditingId === todo.id && (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleUpadateNewTitle(todo.id, newTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => {
              handleUpadateNewTitle(todo.id, newTitle);
            }}
            onKeyUp={handleCancel}
          />
        </form>
      )}

      {/* Overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isLoadingChange && deleteTodoId === todo.id) ||
            (cleanCompleted && todo.completed) ||
            isAdding ||
            isUpdating?.includes(todo.id),
        })}
        key={todo.id}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}

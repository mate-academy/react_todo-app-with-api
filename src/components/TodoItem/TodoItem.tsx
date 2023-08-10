/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  hasLoader: boolean;
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  onChangeTodo: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  hasLoader,
  onDeleteTodo,
  onToggleTodo,
  onChangeTodo,
}) => {
  const { id, title, completed } = todo;
  const [isEditingTodo, setIsEditingTodo] = useState<boolean>(false);
  const editingTodoField = useRef<HTMLInputElement | null>(null);

  const changeTitle = async (idTodo: number, titleTodo: string) => {
    try {
      await onChangeTodo(idTodo, titleTodo);
      setIsEditingTodo(false);
    } catch (e) {
      editingTodoField.current?.focus();
    }
  };

  const handlerDeleteTodo = () => {
    onDeleteTodo(id);
  };

  const handlerToggleTodo = () => {
    onToggleTodo(id, completed);
  };

  const handleClickTodoField = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      setIsEditingTodo(true);
    }
  };

  const handleKeyboardEditingTodoField = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditingTodo(false);
    }

    if (e.key === 'Enter') {
      editingTodoField.current?.blur();
    }
  };

  const handleOnBlurEditingTodoField = () => {
    if (editingTodoField.current) {
      const newTitle = editingTodoField.current.value;

      if (newTitle === title) {
        setIsEditingTodo(false);

        return;
      }

      // onChangeTodo(id, newTitle);
      changeTitle(id, newTitle);
    }
  };

  useEffect(() => {
    if (isEditingTodo) {
      editingTodoField.current?.focus();
    }
  }, [isEditingTodo]);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handlerToggleTodo}
        />
      </label>

      {isEditingTodo ? (
        <form>
          <input
            ref={editingTodoField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onBlur={handleOnBlurEditingTodoField}
            onKeyDown={handleKeyboardEditingTodoField}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onClick={handleClickTodoField}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={handlerDeleteTodo}
      >
        ×
      </button>

      {hasLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

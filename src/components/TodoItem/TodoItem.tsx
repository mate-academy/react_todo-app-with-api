/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  index: number;
  hasLoader: boolean;
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  onChangeTodo: (id: number, title: string) => Promise<void>;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragEnter: (index: number) => void;
  onDragDrop: (index: number) => void;
  draggableIndex: number;
  dragTargetIndex: number;
  isTempSortedItem: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  index,
  hasLoader,
  onDeleteTodo,
  onToggleTodo,
  onChangeTodo,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragDrop,
  draggableIndex,
  dragTargetIndex,
  isTempSortedItem,
}) => {
  const { id, title, completed } = todo;
  const [value, setValue] = useState<string>(title);
  const [isEditingTodo, setIsEditingTodo] = useState<boolean>(false);
  const editingTodoField = useRef<HTMLInputElement | null>(null);

  const todoItem = useRef<HTMLDivElement | null>(null);

  const changeTodoTitle = async (idTodo: number, titleTodo: string) => {
    try {
      await onChangeTodo(idTodo, titleTodo);
      setValue(titleTodo);
      setIsEditingTodo(false);
    } catch {
      if (editingTodoField.current) {
        setValue(title);
        setIsEditingTodo(false);
        editingTodoField.current.blur();
      }
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

  const handleOnBlurEditingTodoField = (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const newTitle = e.target.value;

    if (newTitle === title) {
      setIsEditingTodo(false);

      return;
    }

    changeTodoTitle(id, newTitle);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDragDrop(index);
  };

  useEffect(() => {
    if (isEditingTodo) {
      editingTodoField.current?.focus();
    }
  }, [isEditingTodo]);

  return (
    <div
      className={cn(
        'todo',
        { completed },
        { 'todo-active-drag': draggableIndex === index },
        { 'todo-target-drag': dragTargetIndex === index },
        { 'todo-sorted-temp': isTempSortedItem },
      )}
      ref={todoItem}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={handleDragOver}
      onDrop={handleDragDrop}
    >
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
            value={value}
            onBlur={(e) => handleOnBlurEditingTodoField(e)}
            onKeyDown={handleKeyboardEditingTodoField}
            onChange={e => setValue(e.target.value)}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onClick={handleClickTodoField}
        >
          {value}
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

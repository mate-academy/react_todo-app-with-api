import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletedId: number,
  todoDelete: (todoId: number) => void,
  updateTodo: (todoId: number, status: boolean | string, by: string) => void,
  updatedId: number | string,
  isLoading: boolean,
  setIsLoading: (isLoad: boolean) => void,
  editingId: number,
  setEditingId: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletedId,
  todoDelete,
  updateTodo,
  updatedId,
  isLoading,
  setIsLoading,
  editingId,
  setEditingId,
}) => {
  const { id, title, completed } = todo;
  const [inputTitle, setInputTitle] = useState(title);
  const [onEditing, setOnEditing] = useState(false);

  const onSubmit = (e: FormEvent, todoId: number) => {
    e.preventDefault();
    setIsLoading(true);
    setOnEditing(false);

    if (inputTitle !== title) {
      if (!inputTitle) {
        todoDelete(todoId);
      } else {
        updateTodo(todoId, inputTitle, 'title');
      }
    }

    if (inputTitle === title) {
      setEditingId(0);
      setIsLoading(false);
    }
  };

  const onDoubleClickTitle = () => {
    setOnEditing(true);
    setEditingId(id);
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => {
            updateTodo(id, completed, 'completed');
          }}
        />
      </label>
      {onEditing && editingId === id ? (
        <form
          onSubmit={(e) => onSubmit(e, id)}
          onBlur={(e) => onSubmit(e, id)}
        >
          <input
            className="todoapp__new-todo"
            style={{
              fontSize: 'inherit',
              color: 'inherit',
              border: 'none',
              width: '100%',
              padding: '12px 15px',
              outline: '2px solid black',
              borderRadius: '2px',
            }}
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="Empty todo will be deleted"
            ref={input => input && input.focus()}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={onDoubleClickTitle}
          >
            {inputTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => todoDelete(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        className={classNames(
          'modal overlay',
          {
            'is-active': (deletedId === id || id === 0)
            || (isLoading && updatedId === id)
            || updatedId === id || (updatedId === 1.0 && completed === true)
            || updatedId === 2.0,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { UpdateTodo } from '../../types/UpdateTodo';

interface TodoProps {
  todo: Todo;
  isUpdatingTodo: boolean;
  deletedTodoId: Todo['id'];
  toggledTodoId: Todo['id'];
  updateTitle: string;
  onChangeDeletedTodoId: (deletedTodoId: Todo['id']) => void;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onChangeTodo: ({ id, title, completed }: UpdateTodo) => Promise<void>;
  onToggledTodoId: (toggledTodoId: Todo['id']) => void;
  onUpdateTitle: (updateTitle: string) => void;
}

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isUpdatingTodo,
  deletedTodoId,
  toggledTodoId,
  updateTitle,
  onChangeDeletedTodoId,
  onDeleteTodo,
  onChangeTodo,
  onToggledTodoId,
  onUpdateTitle,
}) => {
  const [isVisibleFormForChange, setIsVisibleFormForChange] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isVisibleFormForChange]);

  const handleChangeTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    inputRef.current?.blur();
  };

  const handleOnDelete = async () => {
    onChangeDeletedTodoId(todo.id);
    onDeleteTodo(todo.id);
  };

  const handleChangeTitleOnBlur = async ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => {
    if (updateTitle === '') {
      try {
        await handleOnDelete();
      } finally {
        onToggledTodoId(0);
        setIsVisibleFormForChange(false);
      }
    } else {
      if (updateTitle !== todo.title) {
        try {
          await onChangeTodo({
            id,
            title,
            completed,
          });
        } catch (error) {
          if (error instanceof Error) {
            setIsVisibleFormForChange(false);
          }
        }
      } else {
        onToggledTodoId(0);
      }
    }

    inputRef.current?.blur();
  };

  const handleOnBlur = () => {
    const trimedTitle = updateTitle.trim();

    setIsVisibleFormForChange(true);
    onToggledTodoId(todo.id);

    handleChangeTitleOnBlur({
      id: todo.id,
      title: trimedTitle,
      completed: todo.completed,
    });

    onUpdateTitle(todo.title);
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsVisibleFormForChange(true);
      onUpdateTitle(todo.title);
    }
  };

  const handleClickCheckbox = () => {
    onChangeTodo({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
    });
    onToggledTodoId(todo.id);
  };

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
          onChange={() => {}}
          onClick={handleClickCheckbox}
        />
      </label>

      {!isVisibleFormForChange ? (
        <form onSubmit={handleChangeTitle} method="PATCH">
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            onBlur={handleOnBlur}
            placeholder="Empty todo will be deleted"
            value={updateTitle}
            onChange={event => onUpdateTitle(event.target.value)}
            onKeyUp={handleOnKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsVisibleFormForChange(false);
              onUpdateTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleOnDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 ||
            todo.id === deletedTodoId ||
            toggledTodoId === todo.id ||
            isUpdatingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import { ChangeEvent, FC, useState } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<boolean>;
  isTemp?: boolean;
  checkTodo(todoId: number, newStatus: boolean): Promise<boolean>;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
};

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo,
  isTemp,
  checkTodo,
  renameTodo,
}) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingSaved, setIsBeingSaved] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleButtonClick = () => {
    setIsBeingSaved(true);

    deleteTodo(todo.id).then(() => {
      setIsBeingSaved(false);
    });
  };

  const handleCheckboxClick = () => {
    setIsBeingSaved(true);

    checkTodo(todo.id, !todo.completed).then(() => {
      setIsBeingSaved(false);
    });
  };

  const handleDoubleClickOnTitle = () => {
    setNewTitle(todo.title);
    setIsBeingEdited(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleInputBlur = () => {
    if (newTitle.trim() !== todo.title) {
      if (newTitle.trim() === '') {
        handleButtonClick();
      }

      setIsBeingSaved(true);
      renameTodo(todo.id, newTitle.trim()).then(didSucceed => {
        if (didSucceed) {
          setIsBeingEdited(false);
        }
        setIsBeingSaved(false);
      });
    } else {
      setIsBeingEdited(false);
    }
  };

  document.body.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      setIsBeingEdited(false);
      setNewTitle(todo.title);
    }
  });

  return (
    <div
      data-cy="Todo"
      className={'todo' + (todo.completed ? ' completed' : '')}
    >
      <label
        onClick={handleCheckboxClick}
        className="todo__status-label"
        htmlFor="input"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          readOnly
          checked={todo.completed}
        />
      </label>

      {isBeingEdited ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleInputBlur();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClickOnTitle}
        >
          {todo.title}
        </span>
      )}

      {!isBeingEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleButtonClick}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={
          'modal overlay' + (isTemp || isBeingSaved ? ' is-active' : '')
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

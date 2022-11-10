import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void;
  proccessedTodoId: number[],
  changeCompleteStatus: (todoId: number, isComplited: boolean) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  deleteTodo,
  proccessedTodoId,
  changeCompleteStatus,
  changeTodoTitle,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const currentTodoField = useRef<HTMLInputElement>(null);

  const [focusOnForm, setFocusOnForm] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const addFocusOnForm = () => {
    setFocusOnForm(true);
  };

  const removeFocusFromForm = () => {
    setFocusOnForm(false);
  };

  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (title !== newTitle) {
      changeTodoTitle(id, newTitle);
    }

    if (newTitle === '') {
      setNewTitle(title);
    }

    removeFocusFromForm();
  };

  const cancelChanging = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      removeFocusFromForm();
    }
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  useEffect(() => {
    if (currentTodoField.current) {
      currentTodoField.current.focus();
    }
  }, [focusOnForm]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={addFocusOnForm}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeCompleteStatus(id, completed)}
        />
      </label>

      {!focusOnForm
        ? (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {newTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form
            onSubmit={handleForm}
            onBlur={handleForm}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={changeTitle}
              onKeyDown={cancelChanging}
              ref={currentTodoField}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': proccessedTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

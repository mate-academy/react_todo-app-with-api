import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  handleChangeComplete: (todoId: number) => void;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditSubmit: (todoId: number) => void | Promise<void>;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  handleDobelChangeTitle: (todo: Todo) => void;
  removeElement: (todoId: number) => void;
  loadingTodoId: number[];
  diseBledX: Todo | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp = false,
  handleChangeComplete,
  editingTodoId,
  setEditingTodoId,
  handleEditSubmit,
  editTitle,
  setEditTitle,
  handleDobelChangeTitle,
  removeElement,
  loadingTodoId,
  diseBledX,
}) => {
  // const changeTitle = () => {
  //   console.log("What hapan");
  //   handleEditSubmit(todo.id);
  // }

  const handgaleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        'is-active': loadingTodoId.includes(todo.id) || isTemp,
      })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Todo status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeComplete(todo.id)}
          disabled={loadingTodoId.includes(todo.id) || isTemp}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEditSubmit(todo.id);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={() => handleEditSubmit(todo.id)}
            onKeyUp={handgaleKeyup}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleDobelChangeTitle(todo)}
        >
          {todo.title}
        </span>
      )}

      {diseBledX?.id !== todo.id && (
        <button
          type="button"
          className="todo__remove "
          data-cy="TodoDelete"
          onClick={() => removeElement(todo.id)}
          hidden={diseBledX?.id === todo.id}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || loadingTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

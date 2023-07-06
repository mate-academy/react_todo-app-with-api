import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number[];
  toggleTodoStatus:(
    todoId: number,
    args: UpdateTodoArgs
  ) => Promise<Todo | null>;
  updatingTodosId: number[]
  selectedTodoId: number | null;
  setSelectedTodoId: (todoId: number | null) => void;
  updateTodoTitle: (todoId: number, args: UpdateTodoArgs)
  => Promise<Todo | null>
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingTodoId,
  toggleTodoStatus,
  updatingTodosId,
  selectedTodoId,
  setSelectedTodoId,
  updateTodoTitle,

}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const isDeletingItem = deletingTodoId.includes(todo.id);
  const isUpdatingItem = updatingTodosId.includes(todo.id);

  const handleToggleTodoStatus = () => toggleTodoStatus(
    todo.id,
    { completed: !todo.completed },
  );

  const clearSelectedTodoId = () => setSelectedTodoId(null);

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todoId: number,
  ) => {
    event.preventDefault();
    setSelectedTodoId(todoId);
  };

  const isSelectedTodoId = selectedTodoId === todo.id;

  const handleInputChanges = (event:React.ChangeEvent<HTMLInputElement>) => (
    setEditedTitle(event.target.value)
  );

  const changeTittleIfEdited = () => {
    if (editedTitle !== todo.title) {
      updateTodoTitle(todo.id, { title: editedTitle });
    }
  };

  const handleOnBlur = () => {
    changeTittleIfEdited();

    clearSelectedTodoId();
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeTittleIfEdited();

    clearSelectedTodoId();
  };

  const handleCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      clearSelectedTodoId();
    }
  };

  return (
    <div
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodoStatus()}
        />
      </label>

      { isSelectedTodoId
        ? (
          <form
            onSubmit={(event) => (handleSubmit(event))}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={(event) => handleInputChanges(event)}
              onBlur={() => handleOnBlur()}
              onKeyDown={(event) => handleCancelEditing(event)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={(event) => handleDoubleClick(event, todo.id)}

            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×

            </button>
          </>
        )}

      <div
        className={cn(
          'modal overlay',
          { ' is-active': isDeletingItem || isUpdatingItem },
        )}
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader " />
      </div>

    </div>
  );
};

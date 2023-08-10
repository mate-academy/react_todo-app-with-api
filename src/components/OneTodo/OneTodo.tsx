import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number[];
  onDeleteTodo: (todoId: number[]) => void,
  onUpdateTodos: (newTodos: Todo[]) => void,
  editedTodoId: number | null,
  onSetEditedTodoId: (editedTodoId: number | null) => void,
  editedTitle: string,
  onSetEditedTitle: (editedTitle: string) => void,
};

export const OneTodo: React.FC<Props> = ({
  todo,
  loadingTodoId,
  onDeleteTodo,
  onUpdateTodos,
  editedTodoId,
  onSetEditedTodoId,
  editedTitle,
  onSetEditedTitle,
}) => {
  const handlerEscCancel = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSetEditedTodoId(null);
    }
  };

  const handlerSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSetEditedTodoId(null);

    if (editedTitle === todo.title) {
      return;
    }

    if (editedTitle.length < 1) {
      onDeleteTodo([todo.id]);

      return;
    }

    onUpdateTodos([{ ...todo, title: editedTitle }]);
  };

  const handlerChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    onSetEditedTitle(newTitle);
  };

  const handlerEditedTodo = () => {
    onSetEditedTodoId(todo.id);
    onSetEditedTitle(todo.title);
  };

  const handlerCompletedTodo = () => {
    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    onUpdateTodos([newTodo]);
  };

  const editedTitleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editedTitleInput.current) {
      editedTitleInput.current.focus();
    }
  }, [editedTodoId]);

  return (
    <div className={classNames(
      'todo', { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handlerCompletedTodo}
          readOnly
        />
      </label>

      {editedTodoId !== todo.id
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={handlerEditedTodo}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo([todo.id])}
            >
              ×
            </button>
          </>
        ) : (
          <form
            onSubmit={handlerSubmit}
          >
            <input
              type="text"
              className="todo__title-update"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handlerChangeTitle}
              onBlur={handlerSubmit}
              onKeyUp={handlerEscCancel}
              ref={editedTitleInput}
            />
          </form>
        )}

      <div className={classNames(
        'modal', 'overlay', { 'is-active': loadingTodoId?.includes(todo.id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

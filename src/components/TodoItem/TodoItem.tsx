import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  selectedTodoId: number | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, data: {}) => void;
  isLoading: boolean;
  changedTodosId: number[];
}

export const TodoItem = (props: Props) => {
  const {
    todo,
    selectedTodoId,
    onDeleteTodo,
    onUpdateTodo,
    isLoading,
    changedTodosId,
  } = props;

  const titleField = useRef<HTMLInputElement>(null);
  const [isDblClicked, setIsDblClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  // ** as soon as appear the editing field immediately focuses on this field ** //
  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isDblClicked]);

  // ** toggle completing todo ** //
  const handleChangeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateTodo(todo.id, { completed: e.target.checked });
  };

  // ** set new title when field unfocused ** //
  const handleBlurEffect = () => {
    setIsDblClicked(false);

    if (todo.title !== newTitle) {
      onUpdateTodo(todo.id, { title: newTitle });
    }
  };

  // ** when key down 'Enter' set new title for todo, but if key down 'Escape' deleted changing and unfocused editing field ** //
  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlurEffect();
    }

    if (e.key === 'Escape') {
      setIsDblClicked(false);
      setNewTitle(todo.title);
    }
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
          defaultChecked={todo.completed}
          onChange={handleChangeChecked}
          disabled={isLoading}
        />
      </label>

      {isDblClicked ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={newTitle}
            ref={titleField}
            disabled={isLoading}
            onBlur={handleBlurEffect}
            onKeyDown={handleOnKeyDown}
            onChange={({ target }) => {
              const { value } = target;

              if (newTitle !== value) {
                setNewTitle(value);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDblClicked(true)}
          >
            {todo.title}
          </span>
          {!isLoading && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDeleteTodo(todo.id);
              }}
            >
              ×
            </button>
          )}
        </>
      )}

      {((todo.id === selectedTodoId && isLoading)
          || changedTodosId.includes(todo.id))
        && (
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              { 'is-active': isLoading },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};

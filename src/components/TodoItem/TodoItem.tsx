import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent, memo, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  selectedTodoId: number | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, data: {}) => void;
  loading: boolean;
  changedTodosId: number[];
  errorMessage: string;
}

export const TodoItem = memo<Props>((props) => {
  const {
    todo,
    selectedTodoId,
    onDeleteTodo,
    onUpdateTodo,
    loading,
    changedTodosId,
    errorMessage,
  } = props;

  const { id, title, completed } = todo;

  const titleField = useRef<HTMLInputElement>(null);
  const [isDblClicked, setIsDblClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // ** as soon as appear the editing field immediately focuses on this field ** //
  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isDblClicked]);

  // ** reset editing field to default condition if didn't update ** //
  useEffect(() => {
    if (errorMessage === 'Unable to update a todo') {
      setNewTitle(title);
    }
  }, [errorMessage]);

  // ** set new title when field unfocused ** //
  const handleBlurEffect = () => {
    setIsDblClicked(false);

    if (newTitle === '') {
      onDeleteTodo(id);
    }

    if (title !== newTitle) {
      onUpdateTodo(id, { title: newTitle });
    }
  };

  // ** when key down 'Enter' set new title for todo, but if key down 'Escape' deleted changing and unfocused editing field ** //
  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlurEffect();
    }

    if (event.key === 'Escape') {
      setIsDblClicked(false);
      setNewTitle(title);
    }
  };

  // ** toggle todo to completed condition or uncompleted ** //
  const toggleCompleted = () => onUpdateTodo(id, { completed: !completed });

  const handleChangedTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (newTitle !== value) {
      setNewTitle(value);
    }
  };

  const isLoading = (id === selectedTodoId && loading)
    || changedTodosId.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={toggleCompleted}
          disabled={loading}
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
            disabled={loading}
            onBlur={handleBlurEffect}
            onKeyDown={handleOnKeyDown}
            onChange={handleChangedTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDblClicked(true)}
          >
            {title}
          </span>
          {!loading && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          )}
        </>
      )}

      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': loading },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
});

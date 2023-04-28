import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enum';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  isLoadingTodo: boolean;
  onChangeStatusTodo?: (todoID: number) => void;
  onChangeNewTitle?: (todoID: number, todoNewTitle: string) => void;
  setErrorMessage: (errorMessage: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isLoadingTodo,
  onChangeStatusTodo,
  onChangeNewTitle,
  setErrorMessage,
}) => {
  const { title, id } = todo;

  const [isClicked, setIsClicked] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isChangedTitle, setIsChangedTitle] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setTodoTitle(value);
  };

  const handleUpdateTitleTodo = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsClicked(false);

    if (todoTitle !== todo.title) {
      try {
        setIsChangedTitle(true);
        await onChangeNewTitle?.(id, todoTitle);
      } catch {
        setErrorMessage(Errors.Edit);
      } finally {
        setIsChangedTitle(false);
      }
    }
  };

  const onBlurUpdateTittleTodo = () => {
    setIsClicked(false);

    if (todoTitle !== todo.title) {
      return onChangeNewTitle?.(id, todoTitle);
    }

    return '';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsClicked(false);
      setTodoTitle(todo.title);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isClicked]);

  return (
    <>
      {isClicked ? (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => onChangeStatusTodo?.(id)}
            />
          </label>

          <form onSubmit={handleUpdateTitleTodo}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleChangeTitleTodo}
              onBlur={onBlurUpdateTittleTodo}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </form>

          {isLoadingTodo && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
          onDoubleClick={() => setIsClicked((prev) => !prev)}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => onChangeStatusTodo?.(id)}
            />
          </label>

          <span className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          {isLoadingTodo && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}

          {isChangedTitle && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

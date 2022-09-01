import classNames from 'classnames';
import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  removeTodo: (n: number) => void,
  changeTodo: (id: number, data: any) => void,
  loadingTodosId: number[],
}

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo,
  changeTodo,
  loadingTodosId,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleChangeOfTitle = () => {
    if (!updatedTitle) {
      removeTodo(id);
    }

    if (updatedTitle === title) {
      setIsDoubleClicked(false);

      return;
    }

    changeTodo(id, { title: updatedTitle });

    setIsDoubleClicked(false);
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => changeTodo(id, { completed: !completed })}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleChangeOfTitle();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={newTodoField}
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => {
                setUpdatedTitle(e.target.value);
              }}
              onBlur={() => handleChangeOfTitle()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsDoubleClicked(false);
                  setUpdatedTitle(title);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsDoubleClicked(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodosId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

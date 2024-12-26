import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useState,
  KeyboardEvent,
  FocusEvent,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { trimString } from '../../utils/trimString';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodoHandler: (todoId: number) => Promise<void>;
  updateTodoHandler: (todo: Todo) => Promise<void>;
  isEditMode?: boolean;
  setEditedTodoId: Dispatch<SetStateAction<number | null>>;
};

export const TodoItem: FC<Props> = props => {
  const {
    todo,
    isLoading,
    deleteTodoHandler,
    updateTodoHandler,
    isEditMode,
    setEditedTodoId,
  } = props;

  const [newTitleValue, setNewTitleValue] = useState(todo.title);

  const inputNewTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNewTitleRef.current) {
      inputNewTitleRef.current.focus();
    }
  }, [newTitleValue]);

  const handleChangeComplete = () => {
    updateTodoHandler({ ...todo, completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setEditedTodoId(todo.id);
  };

  const handleSubmit = async (
    evt: FocusEvent<HTMLFormElement> | FormEvent<HTMLFormElement>,
  ) => {
    evt.preventDefault();

    if (todo.title === trimString(newTitleValue)) {
      setNewTitleValue(todo.title);
      setEditedTodoId(null);

      return;
    }

    try {
      if (!trimString(newTitleValue)) {
        await deleteTodoHandler(todo.id);
      } else {
        await updateTodoHandler({ ...todo, title: trimString(newTitleValue) });
      }

      setEditedTodoId(null);
    } catch (err) {
      inputNewTitleRef?.current?.focus();
      throw err;
    }
  };

  const handleEscTap = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.code === 'Escape') {
      setEditedTodoId(null);
      setNewTitleValue(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="TodoStatus" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeComplete}
        />
      </label>

      {isEditMode ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={newTitleValue}
            onChange={evt => setNewTitleValue(evt.target.value)}
            onKeyUp={handleEscTap}
            ref={inputNewTitleRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteTodoHandler(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

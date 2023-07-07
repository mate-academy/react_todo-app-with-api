import {
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  FormEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  handleRemove: (todoId: number) => Promise<unknown>,
  handleChangeCheckBox: (todoId: number) => void,
  handleSubmitonChange: (
    event: FormEvent,
    newTitle: string,
    id: number,
    edit: (value: boolean) => void,
    editTitle: (value: string) => void,
  ) => void,
}

export const TodoItem: FC<Props> = ({
  todo,
  handleRemove,
  handleChangeCheckBox,
  handleSubmitonChange,
}) => {
  const { completed, title, id } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isEdited]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditChange = () => {
    setIsEdited(prevState => !prevState);
  };

  const exitEdit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEdited(false);
    }
  };

  return (
    <div
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeCheckBox(id)}
        />
      </label>

      {isEdited
        ? (
          <form onSubmit={(event) => (
            handleSubmitonChange(
              event, editedTitle, id, setIsEdited, setEditedTitle,
            ))}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="U can't make an empty title"
              value={editedTitle}
              onChange={handleTitleChange}
              onKeyUp={exitEdit}
              ref={inputRef}
              onBlur={(event) => (
                handleSubmitonChange(
                  event, editedTitle, id, setIsEdited, setEditedTitle,
                ))}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleEditChange}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleRemove(id)}
            >
              ×
            </button>
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
};

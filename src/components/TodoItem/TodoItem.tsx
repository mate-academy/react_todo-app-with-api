import {
  ChangeEvent,
  FC,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/types';

type Props = {
  todo: Todo;
  activeIds: number[];
  handleRemoveTodo: (buttonId: number) => void;
  handleCheckboxChange: (todo: Todo) => void;
  handleTitleChange: (todo: Todo) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  activeIds,
  handleRemoveTodo,
  handleCheckboxChange,
  handleTitleChange,
}) => {
  const { title, completed, id } = todo;
  const [isInputEdited, setIsInputEdited] = useState(false);
  const inputTextElement = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedtitle] = useState(title);

  const handleTitleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.detail === 2 && inputTextElement) {
      setIsInputEdited(true);
    }
  };

  const handleEditedTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedtitle(event.target.value);
  };

  const handleEditedtitleSubmit = () => {
    setIsInputEdited(false);
  };

  useEffect(() => {
    inputTextElement.current?.focus();
    if (!isInputEdited && title !== editedTitle) {
      handleTitleChange({
        ...todo,
        title: editedTitle,
      });
    }
  }, [isInputEdited]);

  useEffect(() => {
    const handlePressKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsInputEdited(false);
        setEditedtitle(title);
      }
    };

    window.addEventListener('keydown', handlePressKey);

    return () => {
      window.removeEventListener('keydown', handlePressKey);
    };
  }, []);

  return (
    <div
      className={cn(
        'todo',
        'item-enter-done',
        { completed },
      )}
      data-cy="todo"
    >
      <span className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCheckboxChange(todo)}
        />
      </span>

      {isInputEdited ? (
        <form className="todo__form" onSubmit={handleEditedtitleSubmit}>
          <input
            type="text"
            className="todo__input"
            placeholder="Empty todo will be deleted"
            onBlur={() => setIsInputEdited(false)}
            ref={inputTextElement}
            value={editedTitle}
            onChange={handleEditedTitleChange}
          />
        </form>
      ) : (
        <>
          <div
            className="todo__title"
            onClick={handleTitleClick}
            aria-hidden="true"
          >
            {title}
          </div>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn(
          'overlay',
          'modal',
          {
            'is-active': activeIds.some(activeId => activeId === id),
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};

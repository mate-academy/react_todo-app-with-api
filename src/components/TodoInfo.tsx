import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (userId: number) => void,
  setNewTitle: (todoId: number, title: string) => void,
  isLoading: boolean,
  toggleTodoStatus: (todoId: number, completed: boolean) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  toggleTodoStatus,
  setNewTitle,
}) => {
  const { completed, title, id } = todo;
  const [isRenameTitle, setIsRenameTitle] = useState(false);
  const [renamedTitle, setRenamedTitle] = useState(title);
  const input = useRef<HTMLInputElement | null>(null);

  const handleUpdateTitle = () => {
    setIsRenameTitle(false);

    if (!renamedTitle.trim()) {
      deleteTodo(id);

      return;
    }

    if (renamedTitle.trim() === title) {
      return;
    }

    setNewTitle(id, renamedTitle);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setRenamedTitle(event.target.value);
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateTitle();
  };

  const handleCancelEditing = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsRenameTitle(false);
      setRenamedTitle(title);
    }
  };

  useEffect(() => {
    if (isRenameTitle && input.current) {
      input.current.focus();
    }
  }, [isRenameTitle]);

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            toggleTodoStatus(id, !completed);
          }}
        />
      </label>

      {isRenameTitle ? (
        <form onSubmit={handleSubmitForm}>
          <input
            ref={input}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={renamedTitle}
            onChange={handleChangeTitle}
            onBlur={handleUpdateTitle}
            onKeyUp={handleCancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setIsRenameTitle(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              deleteTodo(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={
        classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};

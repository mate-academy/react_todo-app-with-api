import cn from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo, UpdatedTodo } from '../../types/Todo';
import { EditForm } from '../EditForm/EditForm';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  deletedTodoId: number[],
  handleUpdateTodo: (todoId: number,
    args: UpdatedTodo) => void,
  updatingTodoIds: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  deletedTodoId,
  handleUpdateTodo,
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

  const handleIsCompletedChange = () => {
    handleUpdateTodo(id, { completed: !completed });
  };

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!editedTitle.trim()) {
      removeTodo(id);
    } else if (title !== editedTitle) {
      handleUpdateTodo(id, { title: editedTitle });
      setIsEdited(false);
    }

    setIsEdited(false);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleIsCompletedChange}
        />
      </label>
      {isEdited
        ? (
          <EditForm
            handleSubmit={handleSubmit}
            editedTitle={editedTitle}
            handleTitleChange={handleTitleChange}
            exitEdit={exitEdit}
            inputRef={inputRef}
          />
        )
        : (
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
              onClick={() => removeTodo(id)}
            >
              ×
            </button>

            <div className={cn('modal', 'overlay', {
              'is-active': todo.id === 0 || deletedTodoId.includes(id),
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
};

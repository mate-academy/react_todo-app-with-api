import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { EventType } from '../../types/types';

interface Props {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  todosLoader: boolean,
  isLoadingCompleted: boolean,
}

export const TodoItem:FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  todosLoader,
  isLoadingCompleted,
}) => {
  const { completed, title, id } = todo;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const shouldShowLoader = todosLoader
  || isLoading
  || (isLoadingCompleted && completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleCheckboxClick = async () => {
    setIsLoading(true);

    await updateTodo(
      todo.id,
      { completed: !completed },
      setTodos,
      setErrorMessage,
    );

    setIsLoading(false);
  };

  const handleTodoDelete = async () => {
    setIsLoading(true);

    await deleteTodo(id, setTodos, setErrorMessage);

    setIsLoading(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const saveChanges = async () => {
    if (editedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim()) {
      setIsLoading(true);

      await deleteTodo(id, setTodos, setErrorMessage);

      setIsLoading(false);
      setIsEditing(false);

      return;
    }

    setIsLoading(true);
    await updateTodo(id, { title: editedTitle }, setTodos, setErrorMessage);
    setIsLoading(false);
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (editedTitle !== title) {
      saveChanges();
    }

    setIsEditing(false);
  };

  const handleTitleChange = (event: EventType) => {
    setEditedTitle(event.target.value);
  };

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      saveChanges();
    } else if (key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo${completed ? ' completed' : ''}`}>
      {shouldShowLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
      {isEditing
        ? (
          <>
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyDown={event => {
                  onKeyDown(event.key);
                }}
                ref={inputRef}
              />
            </form>
          </>
        )
        : (
          <>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                onClick={handleCheckboxClick}
                onDoubleClick={handleDoubleClick}
                checked={completed}
              />
            </label>

            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoDelete}
            >
              ×
            </button>
          </>
        )}
    </div>
  );
};

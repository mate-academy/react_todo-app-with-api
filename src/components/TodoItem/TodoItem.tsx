import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { EventType } from '../../types/types';
import { useTodosContext } from '../../context/useTodosContext';

interface Props {
  todo: Todo,
}

export const TodoItem:FC<Props> = ({
  todo,
}) => {
  const { completed, title, id } = todo;

  const {
    setTodos,
    setErrorMessage,
    isLoadingCompleted,
    todosLoader,
  } = useTodosContext();

  const todoTitleRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const shouldShowLoader = todosLoader
  || isLoading
  || (isLoadingCompleted && completed);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [isEditing]);

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
  };

  const handleTitleChange = (event: EventType) => {
    setEditedTitle(event.target.value);
  };

  const onKeyDown = (key: string) => {
    if (key === 'Enter') {
      saveChanges();
      setIsEditing(false);
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
                ref={todoTitleRef}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyDown={event => {
                  onKeyDown(event.key);
                }}
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

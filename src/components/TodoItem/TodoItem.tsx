import classNames from 'classnames';
import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number | null;
  toggleLoader: boolean;
  completedIds: number[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  onUpdate,
  isLoading,
  selectedId,
  toggleLoader,
  completedIds,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const handleTitleChange = useCallback((event: FormEvent) => {
    event.preventDefault();
    setDoubleClick(false);

    if (!newTitle.trim()) {
      removeTodo(todo.id);
    } else if (newTitle.trim() !== todo.title) {
      onUpdate(todo.id, { title: newTitle });
    }
  }, [newTitle]);

  const selected = selectedId === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
          disabled={isLoading}
        />
      </label>

      {doubleClick
        ? (
          <form onSubmit={handleTitleChange}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setDoubleClick(false);
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
              onDoubleClick={() => {
                setDoubleClick(true);
                setNewTitle(todo.title);
              }}
              onBlur={() => setDoubleClick(false)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>

            {(selected || toggleLoader || completedIds?.includes(todo.id)) && (
              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal overlay',
                  { 'is-active': isLoading },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </>
        )}
    </div>
  );
};

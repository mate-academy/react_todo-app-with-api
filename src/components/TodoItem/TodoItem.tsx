import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (deletingTodoId: number) => void,
  isAdding?: boolean,
  onTodoSelect: (todo: Todo) => void,
  onChangeTitle: (todo: Todo, newTitle: string) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isAdding,
  onTodoSelect,
  onChangeTitle,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  });

  const handleTitleEdit = useCallback(() => {
    onChangeTitle(todo, newTitle);
    setIsChanging(false);
  }, [newTitle]);

  const hendleCancelEdit = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsChanging(false);
        setNewTitle(todo.title);
      }
    }, [],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onTodoSelect(todo)}
        />
      </label>

      {isChanging
        ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleTitleEdit();
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoTitle}
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleTitleEdit}
              onKeyDown={hendleCancelEdit}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsChanging(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'is-active': isAdding,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

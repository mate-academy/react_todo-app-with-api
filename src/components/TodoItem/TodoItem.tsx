import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onTodoDelete?: (todoId: number) => Promise<void>;
  isDeleting?: boolean;
  onEditTodo?: (todoId: number,
    dataToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>) => Promise<void>
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onTodoDelete = () => { },
  isDeleting,
  onEditTodo = () => { },
}) => {
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing === true) {
      todoTitleField.current?.focus();
    }
  }, [isEditing]);

  const handleTitleChange = () => {
    if (!tempTitle) {
      onTodoDelete(todo.id);
      setIsEditing(false);

      return;
    }

    if (todo.title !== tempTitle) {
      onEditTodo(todo.id, { title: tempTitle });
    }

    setIsEditing(false);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onEditTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTitleChange}>
            <input
              data-cy="TodoTitleField"
              ref={todoTitleField}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={tempTitle}
              onChange={(event) => setTempTitle(event.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeydown}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onTodoDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isDeleting || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

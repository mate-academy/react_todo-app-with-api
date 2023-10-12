import cn from 'classnames';
import { KeyboardEventHandler, useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useTodo } from '../providers/AppProvider';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const {
    removeTodoContext,
    setEditedTodo,
    editedTodo,
    updateTodoContext,
    editedTitleTodo,
  } = useTodo();
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = (): void => {
    setEditedTodo(todo);
    setIsEditing(true);
  };

  const handleEdit: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);

      setIsEditing(false);

      return;
    }

    if (event.key === 'Enter') {
      if (editedTodo?.title.trim() === '') {
        removeTodoContext(todo.id);
      }

      if (!editedTodo) {
        return;
      }

      editedTitleTodo(editedTodo);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editedTodo?.title.trim() === '') {
      removeTodoContext(todo.id);
    } else if (editedTodo?.title.trim() === todo.title) {
      setEditedTodo(null);
    } else {
      if (!editedTodo) {
        return;
      }

      editedTitleTodo(editedTodo);
    }

    setIsEditing(false);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => updateTodoContext(
              { ...todo, completed: !todo.completed },
            )}

          />
        </label>
        {isEditing
          ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTodo?.title}
                onChange={(e) => {
                  setEditedTodo({ ...todo, title: e.target.value });
                }}
                onKeyDown={handleEdit}
                onBlur={handleBlur}
                /* eslint-disable-next-line */
                autoFocus
              />
            </form>
          ) : (
            /* eslint-disable-next-line */
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setIsEditing(!isEditing);
                }
              }}
            >
              {todo.title}
            </span>
          )}

        {!isEditing
        && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setEditedTodo(todo);
              removeTodoContext(todo.id);
            }}
          >
            ×
          </button>
        )}

        <Loader todoId={todo.id} />
      </div>
    </>
  );
};

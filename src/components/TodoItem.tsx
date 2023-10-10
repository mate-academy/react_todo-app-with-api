import cn from 'classnames';
import { FormEventHandler, KeyboardEventHandler } from 'react';
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

  const handleDoubleClick = (): void => {
    setEditedTodo(todo);
  };

  const handleEditSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!editedTodo) {
      return;
    }

    editedTitleTodo(editedTodo);
  };

  const handleEdit: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);

      return;
    }

    if (event.key === 'Enter') {
      if (editedTodo?.title.trim() === '') {
        removeTodoContext(todo.id);
      }
    }
  };

  const handleBlur = () => {
    if (editedTodo?.title.trim() === '') {
      removeTodoContext(todo.id);
    } else if (editedTodo?.title.trim() === todo.title) {
      setEditedTodo(null);
      return;
    } else {
      if (!editedTodo) {
        return;
      }

      editedTitleTodo(editedTodo);
    }
  }

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
        {editedTodo?.id === todo.id
          ? (
            <form onSubmit={handleEditSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder='Empty todo will be deleted'
                value={editedTodo.title}
                onChange={(e) => {
                  setEditedTodo({ ...todo, title: e.target.value });
                }}
                onKeyDown={handleEdit}
                onBlur={handleBlur}
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>
          )}

        {!editedTodo
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

        <Loader />
      </div>
    </>
  );
};

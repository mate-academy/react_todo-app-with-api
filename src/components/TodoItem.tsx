import cn from 'classnames';
import { FormEventHandler, KeyboardEventHandler } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useTodo } from '../providers/AppProvider';
import { updateTodos } from '../api/todos';
import { getError } from '../utils/error';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const {
    removeTodoContext,
    setEditedTodo,
    editedTodo,
    updateTodoContext,
    setError,
    setTodos,
  } = useTodo();

  const handleDoubleClick = (): void => {
    setEditedTodo(todo);
  };

  const handleEditSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setTodos(prev => {
      const copyTodos = [...prev];
      const currentTodo = copyTodos.find(v => v.id === editedTodo?.id);

      if (!currentTodo || !editedTodo) {
        return [];
      }

      currentTodo.title = editedTodo.title.trim();

      return copyTodos;
    });

    if (!editedTodo) {
      return;
    }

    updateTodos(editedTodo)
      .catch(() => setError(getError('updateError')))
      .finally(() => setEditedTodo(null));
  };

  const handleEdit: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);

      return;
    }

    if (event.key === 'Enter') {
      if (editedTodo?.title.trim() === '') {
        setEditedTodo(null);
        setError('Title should not be empty');
      }
    }
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
        {editedTodo?.id === todo.id
          ? (
            <form onSubmit={handleEditSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editedTodo.title}
                onChange={(e) => {
                  setEditedTodo({ ...todo, title: e.target.value });
                }}
                onKeyDown={handleEdit}
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

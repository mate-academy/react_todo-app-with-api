import cn from 'classnames';
import {
  memo, useEffect, useState, FC, useRef,
} from 'react';
import { Todo } from '../../types/Todo';
import { patchTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isClearCompletedTodos: boolean;
  isEditingTodos: boolean;
  onUpdateCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  loadTodos: () => void;
  todos: Todo[];
}

export const TodoItem: FC<Props> = memo(({
  todo,
  isClearCompletedTodos,
  isEditingTodos,
  onUpdateCompleted,
  onDelete,
  loadTodos,
  todos,
}) => {
  const { completed, id, title } = todo;
  const [todoIsEditing, setTodoIsEditing] = useState(false);
  const [todoEditTitle, setTodoEditTitle] = useState(title);
  const [todoIsLoading, setTodoIsLoading] = useState(false);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTodoIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleEscape);

    setTodoIsLoading(false);

    return (() => {
      document.removeEventListener('keyup', handleEscape);
    });
  }, [completed, title]);

  useEffect(() => {
    if (isClearCompletedTodos && completed) {
      setTodoIsLoading(true);
    }
  }, [isClearCompletedTodos]);

  const { length } = todos;
  const completedLength = todos.filter(t => t.completed).length;

  useEffect(() => {
    if (!completed) {
      setTodoIsLoading(true);
    }

    if (completedLength === length) {
      setTodoIsLoading(true);
    }
  }, [isEditingTodos]);

  useEffect(() => {
    setTodoIsLoading(false);
    if (id === 0) {
      setTodoIsLoading(true);
    }
  }, []);

  const handleEditTodo = async (event: any) => {
    event.preventDefault();

    if (title !== todoEditTitle) {
      setTodoIsLoading(true);
      await patchTodo(id, { title: todoEditTitle });
    }

    if (todoEditTitle === '') {
      setTodoIsLoading(true);
      onDelete(id);
    }

    loadTodos();
    setTodoIsEditing(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoIsEditing) {
      inputRef.current?.focus();
    }
  }, [todoIsEditing]);

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {
            onUpdateCompleted(id, completed);
            setTodoIsLoading(true);
          }}
        />
      </label>

      {todoIsEditing
        ? (
          <form
            onSubmit={handleEditTodo}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoEditTitle}
              onChange={(event) => setTodoEditTitle(event.target.value)}
              onBlur={handleEditTodo}
              ref={inputRef}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setTodoIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                onDelete(id);
                setTodoIsLoading(true);
              }}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': todoIsLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

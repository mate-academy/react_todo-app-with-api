import cn from 'classnames';
import {
  useEffect, useRef, useState,
} from 'react';
import { TodoType } from '../../types/Todo';
import { useTodosContext } from '../../providers/TodosProvider/TodosProvider';

type TodoProps = {
  todo: TodoType,
};

export const Todo = ({ todo }: TodoProps) => {
  const [editedTodo, setEditedTodo] = useState<TodoType | null>(null);
  const [editedInput, setEditedInput] = useState<string>('');
  const {
    editTodo,
    delTodo,
    uploading,
  } = useTodosContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTodo?.id === todo.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editedTodo, todo.id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedInput.trim().length === 0) {
      return delTodo(todo);
    }

    if (editedInput.trim() === todo.title) {
      return setEditedTodo(null);
    }

    return editTodo({
      ...todo,
      title: editedInput.trim(),
    });
  };

  const handleBlur = async () => {
    if (editedInput.trim().length === 0) {
      return delTodo(todo);
    }

    if (editedInput.trim() === todo.title) {
      return setEditedTodo(null);
    }

    return editTodo({
      ...todo,
      title: editedInput.trim(),
    });
  };

  useEffect(() => {
    if (uploading.length === 0) {
      setEditedInput('');
      setEditedTodo(null);
    }
  }, [uploading]);

  const onEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedInput('');
      setEditedTodo(null);
    }
  };

  return (
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
          onChange={() => editTodo({
            ...todo,
            completed: !todo.completed,
          })}
        />
      </label>
      {editedTodo?.id === todo.id
        && (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedInput}
              onChange={(e) => setEditedInput(e.target.value.trimStart())}
              ref={inputRef}
              onKeyUp={(e) => onEscape(e)}
              onBlur={() => handleBlur()}
            />
          </form>
        )}
      {editedTodo?.id !== todo.id
        && (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setEditedTodo(todo);
                setEditedInput(todo.title);
              }}
            >
              {editedInput || todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => delTodo(todo)}
              hidden={uploading.includes(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': uploading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

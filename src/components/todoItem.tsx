import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { deleteTodos, updateTodo } from '../api/todos';
import { ErrorMesagges } from '../types/enums';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  deletingIds?: number[] | null;
  setDeletingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;
  isAllTodosCompleted?: boolean;
  isCompletedIds?: number[] | null;
  isLoadingIds?: number[] | null;
  setIsLoadingIds?: React.Dispatch<React.SetStateAction<number[] | []>>;
  onToggle?: (id: number, completed: boolean) => void;
  setErrorMessage?: (value: ErrorMesagges) => void;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  deletingIds,
  setDeletingIds,
  isAllTodosCompleted,
  isCompletedIds,
  isLoadingIds,
  setIsLoadingIds,
  onToggle,
  setErrorMessage,
  setTodos,
}) => {
  const [updateInputQuery, setUpdateInputQuery] = useState<string>(todo.title);
  const [isUpdateTitle, setIsUpdateTitle] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLoader =
    todo.id === 0 ||
    deletingIds?.includes(todo.id) ||
    isCompletedIds?.includes(todo.id) ||
    isLoadingIds?.includes(todo.id);

  const handleUpdateTitle = () => {
    setIsUpdateTitle(true);
  };

  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsLoadingIds?.(prev => [...prev, todo.id]);

      try {
        if (updateInputQuery.trim() === '') {
          const response = await deleteTodos(todo.id);

          if (response) {
            setTodos?.(prev => prev.filter(x => x.id !== todo.id));
          }
        } else if (updateInputQuery.trim() !== todo.title) {
          const updatedTodo = await updateTodo(todo.id, {
            title: updateInputQuery.trim(),
          });

          setTodos?.(prev => {
            return prev.map(prevTodo =>
              prevTodo.id === todo.id ? updatedTodo : prevTodo,
            );
          });
        }

        setIsUpdateTitle(false);
      } catch (error) {
        setErrorMessage?.(
          updateInputQuery.trim() === ''
            ? ErrorMesagges.UnableDelete
            : ErrorMesagges.UnableUpdate,
        );
      } finally {
        setIsLoadingIds?.(prev => prev.filter(id => id !== todo.id));
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsUpdateTitle(false);
    }
  };

  const handleBlur = async () => {
    const trimmed = updateInputQuery.trim();

    if (updateInputQuery.trim() === '') {
      const response = await deleteTodos(todo.id);

      if (response) {
        setTodos?.(prev => prev.filter(x => x.id !== todo.id));
      }
    } else if (trimmed && trimmed !== todo.title) {
      setIsLoadingIds?.(prev => [...prev, todo.id]);
      try {
        const updatedTodo = await updateTodo(todo.id, { title: trimmed });

        setTodos?.(prev =>
          prev.map(prevTodo =>
            prevTodo.id === todo.id ? updatedTodo : prevTodo,
          ),
        );
      } catch (error) {
        setErrorMessage?.(ErrorMesagges.UnableUpdate);
      } finally {
        setIsUpdateTitle(false);
        setIsLoadingIds?.(prev => prev.filter(id => id !== todo.id));
      }
    } else {
      setIsUpdateTitle(false);
    }
  };

  useEffect(() => {
    if (isUpdateTitle && inputRef) {
      inputRef?.current?.focus();
    }
  }, [isUpdateTitle, inputRef]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: isAllTodosCompleted || todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as completed"
          disabled={todo.id === 0}
          checked={todo.completed}
          onChange={async e => {
            const isChecked = e.target.checked;

            setIsLoadingIds?.(prev => [...prev, todo.id]);

            try {
              await updateTodo(todo.id, { completed: isChecked });
              onToggle?.(todo.id, isChecked);
            } catch (error) {
              setErrorMessage?.(ErrorMesagges.UnableUpdate);
            } finally {
              setIsLoadingIds?.(prev => prev.filter(id => id !== todo.id));
            }
          }}
        />
      </label>

      {isUpdateTitle ? (
        <form onKeyDown={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={updateInputQuery}
            onChange={e => setUpdateInputQuery(e.target.value)}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleUpdateTitle}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={todo.id === 0}
            onClick={() => {
              onDelete?.(todo.id);
              setDeletingIds?.(prev => [...prev, todo.id]);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;

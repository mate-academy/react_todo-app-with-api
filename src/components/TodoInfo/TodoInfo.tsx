import React, { useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';
import { removeTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo | TempTodo,
  todos?: Todo[],
  setTodos?: (todos: Todo[]) => void,
  setError?: (message: ErrorType) => void,
  addedTodoIsLoading?: boolean,
};
export const TodoInfo: React.FC<Props> = ({
  todo,
  setTodos,
  todos,
  setError,
  addedTodoIsLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const deleteTodo = async () => {
    setLoading(true);
    const filteredTodos = todos?.filter(({ id }) => id !== todo.id);

    try {
      await removeTodo(todo.id);
      if (setTodos) {
        setTodos(filteredTodos as Todo[]);
      }
    } catch {
      if (setError) {
        setError(ErrorType.RemovingError);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTodos = async (completed = todo.completed) => {
    setLoading(true);
    try {
      const updatedTodo: Todo = await updateTodo(
        todo.id,
        completed,
        newTitle,
      );
      const updatedTodos = todos?.map(item => {
        if (item.id === updatedTodo.id) {
          return updatedTodo;
        }

        return item;
      });

      if (setTodos) {
        setTodos(updatedTodos as Todo[]);
      }
    } catch {
      if (setError) {
        setError(ErrorType.UpdatingError);
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      deleteTodo();
    } else {
      updateTodos();
    }

    setIsEditing(false);
  };

  const isActive = loading || addedTodoIsLoading;

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            updateTodos(!todo.completed);
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onBlur={() => {
              setIsEditing(false);
            }}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

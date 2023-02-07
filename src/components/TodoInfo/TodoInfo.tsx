import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';
import { removeTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo | TempTodo,
  todos?: Todo[],
  onSetTodos?: (todos: Todo[]) => void,
  onSetError?: (message: string) => void,
  addedTodoIsLoading?: boolean,
};
export const TodoInfo: React.FC<Props> = ({
  todo,
  onSetTodos,
  todos,
  onSetError,
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
      if (onSetTodos) {
        onSetTodos(filteredTodos as Todo[]);
      }
    } catch {
      if (onSetError) {
        onSetError('Unable to delete a todo');
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

      if (onSetTodos) {
        onSetTodos(updatedTodos as Todo[]);
      }
    } catch {
      if (onSetError) {
        onSetError('Unable to update the todo');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (!todo.title) {
      deleteTodo();
    }
  }, []);

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
          onSubmit={(event) => {
            event.preventDefault();
            updateTodos();
            setIsEditing(false);
          }}
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

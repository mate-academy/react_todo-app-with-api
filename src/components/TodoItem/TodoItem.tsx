import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  isTempLoading?: boolean,
  setTodos?: (todos: Todo[]) => void,
  showError?: (title: string) => void,
  todosToRender?: Todo[],
  toBeCleared?: Todo[],
  isToggleAll?: boolean,
  setIsToggleAll?: (val: boolean) => void,
  todos?: Todo[],
  isSameStatus?: boolean,
  toggleAll?: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos = [],
  isTempLoading,
  setTodos = () => {},
  showError = () => {},
  todosToRender = [],
  toBeCleared,
  isToggleAll,
  setIsToggleAll = () => {},
  isSameStatus = false,
  toggleAll = () => {},
}) => {
  const { completed, title, id } = todo;
  const [isBeingEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        if (todosToRender) {
          setTodos(todosToRender.filter(item => item.id !== id));
        }
      })
      .catch(() => {
        showError('Unable to delete todo');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    toBeCleared?.forEach(item => {
      if (item.id === id) {
        onDelete();
      }
    });
  }, [toBeCleared]);

  const onStatusChange = (todoId: number, todoCompleted = !completed) => {
    setIsLoading(true);
    updateTodo(todoId, { completed: todoCompleted }).then(() => {
      if (!isToggleAll) {
        setTodos([...todos].map(item => {
          return item.id === todoId
            ? { ...item, completed: !item.completed }
            : item;
        }));
      }

      if (isToggleAll) {
        toggleAll();
      }
    })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isToggleAll) {
      setIsToggleAll(false);
      if (isSameStatus) {
        onStatusChange(id);
      }

      onStatusChange(id, true);
    }
  }, [isToggleAll]);

  return (
    <div className={`todo${completed ? ' completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onStatusChange(id)}
        />
      </label>

      {isBeingEdited
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      {(isTempLoading || isLoading) && (
        <>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
          </div>
          <Loader />
        </>
      )}
    </div>
  );
};

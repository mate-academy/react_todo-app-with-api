import { useState } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodo } from '../../context/TodoContext';
import { updateTodo } from '../../api/todos';
import { useError } from '../../context/ErrorContext';

type Props = {
  todo: Todo;
  onDelete: (value: Todo) => void;
  onEditedId: (value: number | null) => void;
  isDeleteActive: boolean;
  onDeleteActive?: (value: boolean) => void;
  isToggleActive: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo, onDelete, onEditedId, isDeleteActive, isToggleActive,
}) => {
  const { setTodos } = useTodo();
  const { setErrorMessage } = useError();
  const { id, title, completed } = todo;

  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);

  const [isCompleteActive, setIsCompleteActive] = useState(false);

  const handleComplete = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedTodo = { ...todo, completed: event.target.checked };

    setIsCompleteActive(true);

    updateTodo(todo.id, updatedTodo)
      .then(() => {
        setTodos((prevTodo) => prevTodo.map((currentTodo) => {
          return currentTodo.id === todo.id ? updatedTodo : currentTodo;
        }));
      })
      .catch(() => setErrorMessage('Unable to update todo'))
      .finally(() => setIsCompleteActive(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classnames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleComplete}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => onEditedId(id)}
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setDeletedTodoId(id);
          onDelete(todo);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay', {
            'is-active': (isDeleteActive && id === deletedTodoId)
              || isToggleActive.includes(id) || isCompleteActive,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

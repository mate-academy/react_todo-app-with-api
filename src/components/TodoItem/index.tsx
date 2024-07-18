/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoItemForm } from '../TodoItemForm';

type Props = {
  todo: Todo;
  deletingCompleted: boolean;
  loadingIds: number[];
  handleUpdate: (todo: Todo) => Promise<boolean>;
  onDeleteTodo: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingCompleted,
  loadingIds,
  handleUpdate,
  onDeleteTodo,
}) => {
  const [isLoading, setLoadind] = useState(false);
  const [isEditingTodo, setEditingTodo] = useState(false);

  const { completed, title, id } = todo;

  const inputChangeField = useRef<HTMLInputElement>(null);
  const loaderCases =
    id === 0 ||
    (deletingCompleted && completed) ||
    isLoading ||
    loadingIds.includes(todo.id);

  useEffect(() => {
    if (inputChangeField.current && isEditingTodo) {
      inputChangeField.current.focus();
    }
  }, [isEditingTodo]);

  const updateTodo = () => {
    setLoadind(true);
    const chosenTodo = {
      ...todo,
      completed: !completed,
    };

    handleUpdate(chosenTodo).finally(() => setLoadind(false));
  };

  const removeById = () => {
    setLoadind(true);
    onDeleteTodo(id).finally(() => setLoadind(false));
  };

  const handleTodoItemSubmit = (titleValue: string) => {
    if (!titleValue.trim()) {
      return removeById();
    }

    if (titleValue === title) {
      setEditingTodo(false);

      return;
    }

    setLoadind(true);
    handleUpdate({ ...todo, title: titleValue.trim() })
      .then(response => setEditingTodo(response))
      .finally(() => setLoadind(false));
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={updateTodo}
        />
      </label>

      {isEditingTodo ? (
        <div onKeyUp={event => event.key === 'Escape' && setEditingTodo(false)}>
          <TodoItemForm
            title={title}
            onSubmit={handleTodoItemSubmit}
            inputChangeField={inputChangeField}
          />
        </div>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodo(true)}
        >
          {title}
        </span>
      )}

      {!isEditingTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={removeById}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('overlay modal', {
          'is-active': loaderCases,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

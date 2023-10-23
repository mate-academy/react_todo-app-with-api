import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoEditForm } from './TodoEditForm';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => void;
  activeTodoIds?: number[];
  onStatusChange: (todo: Todo) => void;
  setError: (error: string) => void;
  onTodoEdit: (editedTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete,
  activeTodoIds,
  onStatusChange,
  setError,
  onTodoEdit,
}) => {
  const [isTodoEdited, setIsTodoEdited] = useState(false);
  const [isTodoSaving, setIsTodoSaving] = useState(false);

  const handleRemoveTodo = () => {
    onTodoDelete(todo.id);
  };

  const handleStatusChange = (toggledTodo: Todo) => {
    onStatusChange(toggledTodo);
  };

  const handleDoubleClick = () => {
    setIsTodoEdited(true);
  };

  const isModalActive = todo.id === 0
    || activeTodoIds?.includes(todo.id)
    || isTodoSaving;

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={() => handleStatusChange(todo)}
        />
      </label>

      {isTodoEdited
        ? (
          <TodoEditForm
            todoTitle={todo.title}
            onTodoEditSubmit={setIsTodoEdited}
            onTodoDelete={onTodoDelete}
            todoId={todo.id}
            onTodoSave={setIsTodoSaving}
            setError={setError}
            onTodoEdit={onTodoEdit}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', { 'is-active': isModalActive })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

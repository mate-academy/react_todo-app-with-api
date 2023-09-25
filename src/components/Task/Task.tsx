import { useEffect, useRef } from 'react';
import { useTodo } from '../../provider/todoProvider';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const Task = ({ todo }: Props) => {
  const {
    temptTodo,
    editedTodo,
    todos,
    newTitle,
    removeTask,
    toggleCompletedTodos,
    onTitleEdition,
    closeTitleEdition,
    setNewTitle,
    todoTitleEdition,
  } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  const loaderCases
  = ((temptTodo && temptTodo.id === todo.id)
  || (editedTodo && todo.completed)
  || todo.loaderAfterEditing) as boolean;

  useEffect(() => {
    if (todo.isOnTitleEdition) {
      inputRef.current?.focus();
    }
  }, [todo.isOnTitleEdition]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      todoTitleEdition(todo, newTitle, todos);
    }

    if (e.key === 'Escape') {
      closeTitleEdition(todos, todo.id);
    }
  };

  return (
    <div
      className={
        todo.completed ? 'todo completed' : 'todo'
      }
      onDoubleClick={() => onTitleEdition(todos, todo.id)}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => toggleCompletedTodos(todo)}
          checked={!!todo.completed}
        />
      </label>

      {todo.isOnTitleEdition
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => todoTitleEdition(todo, newTitle, todos)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              data-cy="TodoDelete"
              type="button"
              className="todo__remove"
              onClick={() => removeTask(todo)}
            >
              ×

            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={loaderCases ? 'modal overlay is-active' : 'modal overlay'}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};

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
    isFocusedOnTask,
    removeTask,
    toggleCompletedTodos,
    onTitleEdition,
    closeTitleEdition,
    setNewTitle,
    todoTitleEdition,
  } = useTodo();

  const loaderCases
  = ((temptTodo && temptTodo.id === todo.id)
  || (editedTodo && todo.completed)
  || todo.hasLoader) as boolean;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newTitle.trim() === todo.title) {
        closeTitleEdition(todos, todo.id);
      } else {
        todoTitleEdition(todo, newTitle, todos);
      }
    }

    if (e.key === 'Escape') {
      closeTitleEdition(todos, todo.id);
    }
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (newTitle.trim() === todo.title) {
      closeTitleEdition(todos, todo.id);
    } else {
      todoTitleEdition(todo, newTitle, todos);
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
              onChange={(e) => setNewTitle(e.target.value.trimStart())}
              onBlur={handleOnBlur}
              onKeyDown={handleKeyDown}
              ref={input => isFocusedOnTask && input && input.focus()}
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

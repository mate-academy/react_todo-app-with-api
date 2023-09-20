import { useEffect, useRef } from 'react';
import { useTodo } from '../../provider/todoProvider';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const Task = ({ todo }: Props) => {
  const {
    temptTodo,
    removeTask, editedTodo,
    toggleCompletedTodos,
    titleEdition,
    onTitleEdition,
    todos,
    setNewTitle,
    todoTitleEdition,
    newTitle,
    setTitleEdition,
  } = useTodo();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleEdition && todo.isOnTitleEdition) {
      inputRef.current!.focus();
    }
  }, [titleEdition, todo.isOnTitleEdition]);

  return (
    <div
      className={
        todo.completed ? 'todo completed' : 'todo'
      }
      onDoubleClick={() => onTitleEdition(todos, todo.id)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => toggleCompletedTodos(todo)}
        />
      </label>

      {titleEdition && todo.isOnTitleEdition
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => todoTitleEdition(todo, newTitle, todos)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  todoTitleEdition(todo, newTitle, todos);
                }

                if (e.key === 'Escape') {
                  setTitleEdition(false);
                }
              }}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTask(todo)}
            >
              ×

            </button>
          </>
        )}

      {((temptTodo && temptTodo.id === todo.id)
      || (editedTodo && todo.completed)
          || todo.loaderAfterEditing)
        && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};

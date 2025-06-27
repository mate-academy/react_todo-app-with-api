/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type TodoItemProps = {
  todo: Todo;
  todos: Todo[];
  activeTodoId: number | null;
  removeTodo: (todo: Todo) => void;
  handleUpdateTodo: (id: number, data: Omit<Todo, 'id' | 'userId'>) => void;
  editTodo: number | null;
  setEditTodo: (id: number | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, userId },
  todos,
  removeTodo,
  activeTodoId,
  handleUpdateTodo,
  editTodo,
  setEditTodo,
  setVisibleTodos,
  setTodos,
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const wasEscPressed = useRef(false);

  const submitTitleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editTodo === null) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      const todoToRemove = todos.find(todo => todo.id === editTodo);

      if (todoToRemove) {
        removeTodo(todoToRemove);
      }

      return;
    }

    if (trimmedTitle === title.trim()) {
      setEditTodo(null);

      return;
    }

    await handleUpdateTodo(editTodo, {
      title: trimmedTitle,
      completed: completed,
    });

    setTodos(prev =>
      prev.map(todo =>
        todo.id === editTodo ? { ...todo, title: trimmedTitle } : todo,
      ),
    );

    setVisibleTodos(prev =>
      prev.map(todo =>
        todo.id === editTodo ? { ...todo, title: trimmedTitle } : todo,
      ),
    );

    setEditTodo(null);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: completed },
        { hidden: !todos.length },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            handleUpdateTodo(id, { title: title, completed: !completed });
          }}
        />
      </label>

      {editTodo === id ? (
        <form onSubmit={submitTitleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onBlur={event => {
              if (wasEscPressed.current) {
                wasEscPressed.current = false;

                return;
              }

              submitTitleUpdate(event);
            }}
            onKeyUp={ev => {
              if (ev.key === 'Escape') {
                wasEscPressed.current = true;
                setEditTodo(null);
                setEditedTitle(title);
              }
            }}
            onChange={ev => setEditedTitle(ev.target.value)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditTodo(id);
            }}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              removeTodo({ id, title, completed, userId });
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': activeTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader is-active" />
      </div>
    </div>
  );
};

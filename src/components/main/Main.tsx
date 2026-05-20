import { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';

export const Main = ({
  filteredTodos,
  deleteTodo,
  deletingTodoIds,
  tempTodo,
  updateTodo,
  updatingTodoIds,
}: {
  filteredTodos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  deletingTodoIds: number[];
  tempTodo: Todo | null;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  updatingTodoIds: number[];
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const handleSave = async (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      try {
        await deleteTodo(todo.id);
        setEditingTodoId(null);
      } catch {}

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    try {
      await updateTodo({ ...todo, title: trimmedTitle });
      setEditingTodoId(null);
    } catch {}
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const isTodoLoading =
          deletingTodoIds.includes(todo.id) ||
          updatingTodoIds.includes(todo.id);

        const isEditing = editingTodoId === todo.id;

        return (
          <div
            data-cy="Todo"
            key={todo.id}
            className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
          >
            <label
              className="todo__status-label"
              htmlFor={`todo-status-${todo.id}`}
            >
              <input
                id={`todo-status-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() =>
                  updateTodo({ ...todo, completed: !todo.completed })
                }
              />
              <span className="is-hidden">Todo status</span>
            </label>

            {isEditing ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSave(todo);
                }}
              >
                <input
                  ref={editInputRef}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__clear-app todo__title-field"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={() => handleSave(todo)}
                  onKeyUp={handleKeyUp}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => startEditing(todo)}
              >
                {todo.title}
              </span>
            )}

            {!isEditing && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${isTodoLoading ? 'is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="todo-status-temp">
            <input
              id="todo-status-temp"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => {}}
            />
            <span className="is-hidden">Todo status</span>
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

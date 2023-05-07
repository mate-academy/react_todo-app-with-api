import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { patchTodo } from '../api/todos';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  updateTodo: (updatedTodo: Todo) => void,
  removeLoadingTodo: (todoId: number) => void,
  addLoadingTodo: (todoId: number) => void,
  loadingTodos: number[],
  deletingTodoId: number | null,
  isLoading: boolean,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  updateTodo,
  removeLoadingTodo,
  addLoadingTodo,
  loadingTodos,
  deletingTodoId,
  isLoading,
  updateTodoOnServer,
}) => {
  const { id, title, completed } = todo;

  const [checked, setChecked] = useState(completed);
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = () => {
    if (!newTitle.trim()) {
      onDelete(id);
      setIsEditing(false);

      return;
    }

    if (newTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    updateTodoOnServer(id, { title: newTitle });
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleTodoCheck = async () => {
    try {
      addLoadingTodo(todo.id);
      const updatedTodo = { ...todo, completed: !todo.completed };

      setChecked(updatedTodo.completed);
      await patchTodo(todo.id, updatedTodo);
      updateTodo(updatedTodo);
    } finally {
      removeLoadingTodo(todo.id);
    }
  };

  return (
    <section className="todoapp__main">
      <div
        onDoubleClick={() => setIsEditing(true)}
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onChange={handleTodoCheck}
            checked={checked}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleTitleChange}>
            <input
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={() => handleTitleChange()}
              onKeyUp={handleKeyUp}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{ title }</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

        <div className={classNames(
          'modal overlay',
          {
            'is-active': loadingTodos.includes(todo.id)
              || deletingTodoId === todo.id
              || isLoading,
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};

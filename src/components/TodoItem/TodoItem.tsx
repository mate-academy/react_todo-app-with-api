import classNames from 'classnames';
import { useState } from 'react';
import { PatchedTodo, Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { updateTodoTitle } from '../../api/todos';

  type Props = {
    todo: Todo
    onChangeIsError: (e: Errors) => void
    onDeleteTodo: (todoId: number) => void
    onChangeTodo:
    (id: number, data: PatchedTodo) => void;
  };

export const TodoItem: React.FC<Props> = ({
  todo,
  onChangeIsError,
  onDeleteTodo,
  onChangeTodo,
}) => {
  let { title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleteTodo = () => {
    try {
      onDeleteTodo(todo.id);
    } catch {
      onChangeIsError(Errors.DELETE);
    }
  };

  const handleChangeTitle = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewTitle(title);
  };

  const updateTitle = () => {
    if (newTitle === title) {
      cancelEditing();
    }

    if (!newTitle.trim()) {
      onDeleteTodo(todo.id);

      return;
    }

    try {
      updateTodoTitle(todo.id, newTitle);
      title = newTitle;
      setIsEditing(false);
    } catch {
      setIsEditing(true);
      onChangeIsError(Errors.UPDATE);
    } finally {
      setIsEditing(false);
      title = newTitle;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  const handleBlur = async () => {
    setIsEditing(false);

    if (newTitle !== title) {
      updateTitle();
    }
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <>
      <section className="todoapp__main">
        <div
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              // eslint-disable-next-line max-len
              onChange={() => onChangeTodo(todo.id, { completed: !todo.completed })}
            />
          </label>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todo__title todo__input"
                value={newTitle}
                onChange={(event) => {
                  setNewTitle(event.target.value);
                }}
                onBlur={handleBlur}
                onKeyUp={handleEscape}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </form>
          ) : (
            <span className="todo__title" onDoubleClick={handleChangeTitle}>
              {newTitle}
            </span>
          )}

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </section>
    </>
  );
};

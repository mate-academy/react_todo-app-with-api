import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  processingTodos: number[];
  onUpdateTodo: (id: number, title: string, status: boolean,) => void;
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDeleteTodo,
  processingTodos,
  onUpdateTodo,
}) => {
  const { title, completed, id } = todo;

  const [todoStatus, setTodoStatus] = useState(completed);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [titleTodo, setTitleTodo] = useState(title);

  const handleToggleStatus = () => {
    setTodoStatus(prevState => !prevState);

    onUpdateTodo(id, title, !todoStatus);
  };

  const handleToggleEditingForm = () => {
    setIsEditingForm(true);
  };

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const handleChangeTitle = () => {
    if (!titleTodo.trim()) {
      onDeleteTodo(id);

      return;
    }

    if (titleTodo === title) {
      setIsEditingForm(false);

      return;
    }

    onUpdateTodo(id, titleTodo, completed);
    setIsEditingForm(false);
  };

  const handleSubmitTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleChangeTitle();
  };

  const handleCancelForm = (event : React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingForm(false);
      setTitleTodo(title);
    }
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
          onClick={handleToggleStatus}
        />
      </label>

      {isEditingForm
        ? (
          <form onSubmit={handleSubmitTitle}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleTodo}
              onChange={handleInputTitle}
              onBlur={handleChangeTitle}
              onKeyUp={handleCancelForm}
              /* eslint-disable-next-line */
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleToggleEditingForm}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}
      <div className={cn(
        'modal overlay',
        { 'is-active': id === 0 || processingTodos.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

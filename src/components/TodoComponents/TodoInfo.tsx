import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: (id: number) => Promise<void>,
  activeTodoIds: number[],
  onTodoToogle: (id: number, completed: boolean) => Promise<void>,
  updateTitle: (id: number, title: string) => Promise<void>,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  onRemove,
  activeTodoIds,
  onTodoToogle,
  updateTitle,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const selectedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = (todoId: number, TodoTitle: string) => {
    setSelectedTodo(todoId);
    setNewTitle(TodoTitle);
  };

  const stopEditingTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  const saveOnBlur = () => {
    setSelectedTodo(null);

    if (newTitle.trim() === title) {
      return;
    }

    setNewTitle(newTitle.trim());
    updateTitle(id, newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveOnBlur();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onTodoToogle(id, !completed)}
          defaultChecked
        />
      </label>

      {selectedTodo === id
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={selectedTodoField}
              className="todo__title-field"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={saveOnBlur}
              onKeyDown={stopEditingTitle}
              placeholder="Empty todo will be deleted"
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(id, title)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': activeTodoIds.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

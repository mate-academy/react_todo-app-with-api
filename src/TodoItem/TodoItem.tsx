/* eslint-disable linebreak-style */
import React, { ChangeEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => Promise<void>;
  updateTodoChek: (todoId: number, completed: boolean) => Promise<void>;
  updateTodoTitle: (arg: number, title: string) => Promise<void>;
  setTodoEditingId: (arg: number | null) => void;
  setIsUpdatingError: (arg: boolean) => void;
  todoEditingId: number | null;
  todosForRemove: Todo[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodoChek,
  updateTodoTitle,
  setTodoEditingId,
  todoEditingId,
  setIsUpdatingError,
  todosForRemove,
}) => {
  const { completed, title, id } = todo;
  const [selected, setSelected] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleted = (selectedId: number) => {
    setSelected(selectedId);
    removeTodo(selectedId);
  };

  const updateTodoHandlerChek = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateTodoChek(id, event.target.checked);
    },
    [],
  );

  const updateTodoHandlerTitle = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setSelected(id);

    if (!newTitle.trim()) {
      setIsUpdatingError(true);
      setSelected(null);

      return;
    }

    await updateTodoTitle(id, newTitle);
    setTodoEditingId(null);
    setSelected(null);
  }, [newTitle]);

  const loading = todosForRemove.includes(todo) || todo.id === selected;

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={updateTodoHandlerChek}
        />
      </label>

      {todoEditingId === id ? (
        <form onSubmit={updateTodoHandlerTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setTodoEditingId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleted(todo.id)}
          >
            ×
          </button>
        </>
      )}
      {loading && <Loader />}
    </div>
  );
};

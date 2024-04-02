/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { changeTodo, deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodoContext/TodoProvider';
import { LoadOverlay } from './LoadOverlay';
import { TodoError } from '../../types/errors';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onError: (err: string) => void;
  onUpdate: (todo: Partial<Todo>) => void;
}

export const TodoComponent: React.FC<Props> = (props) => {
  const {
    todo, onDelete, onError, onUpdate,
  } = props;

  const loading = todo.id === 0;
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), [editing]);

  const { upatingTodos, addTodoForUpdate, removeTodoForUpdate }
    = useContext(TodosContext);

  const deleting = upatingTodos.some(({ id }) => todo.id === id);

  const showUpdating = deleting || loading || updating;

  function removeTodo(): void {
    addTodoForUpdate(todo);

    deleteTodo(todo.id)
      .then(() => onDelete(todo.id))
      .catch(() => {
        onError(TodoError.DeleteTodo);
        removeTodoForUpdate(todo);
      })
      .finally(() => removeTodoForUpdate(todo));
  }

  const toogleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const changedTodo: Partial<Todo> = {
      id: todo.id,
      completed: event.target.checked,
    };

    setUpdating(true);
    changeTodo(changedTodo)
      .then(res => {
        onUpdate(res);
      })
      .catch(() => onError(TodoError.TodoUpdate))
      .finally(() => setUpdating(false));
  };

  function handleDoubleClick(): void {
    setEditing(true);
  }

  function cancelEditing():void {
    setUpdating(false);
    setEditing(false);
  }

  function saveEditedTodo() {
    const value = newTitle.trim();

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!value && value !== todo.title) {
      setUpdating(true);

      const updatedTodo: Partial<Todo> = {
        id: todo.id,
        title: value,
      };

      changeTodo(updatedTodo)
        .then((editetTodo => {
          onUpdate(editetTodo);
          setEditing(false);
        }))
        .catch(() => onError(TodoError.TodoUpdate))
        .finally(() => setUpdating(false));
    }

    if (!value) {
      removeTodo();
    }

    if (value === todo.title) {
      cancelEditing();
    }
  }

  function handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    saveEditedTodo();
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toogleCheck}
        />
      </label>

      {!!editing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onBlur={saveEditedTodo}
            onKeyDown={handleKey}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <LoadOverlay showUpdating={showUpdating} />
        </form>
      )}

      {!editing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>

          <LoadOverlay showUpdating={showUpdating} />
        </>
      )}
    </div>
  );
};

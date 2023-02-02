import React, {
  memo, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo
  deletedTodo: (todoId: number) => void
  deletingTodoIds: number[]
  onUpdatingTodo: (todoId: Todo) => void
  updatingTodoIds: number[]
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  deletedTodo,
  deletingTodoIds,
  onUpdatingTodo,
  updatingTodoIds,
}) => {
  const [todoTitleField, setTodoTitleField] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = todo.id === 0
    || deletingTodoIds.includes(todo.id) || updatingTodoIds.includes(todo.id);

  const titleTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleTodoField.current) {
      titleTodoField.current.focus();
    }
  }, [isEditing]);

  const toggleStatusTodo = () => {
    onUpdatingTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  const cancelEditing
    = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setTodoTitleField(todo.title);
        setIsEditing(false);
      }
    };

  const onSubmitChangingTitle
    = (event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>) => {
      event.preventDefault();

      if (todo.title !== todoTitleField) {
        onUpdatingTodo({
          ...todo,
          title: todoTitleField,
        });
      }

      if (!todoTitleField.length) {
        deletedTodo(todo.id);
      }

      setIsEditing(false);
    };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >

      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={toggleStatusTodo}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deletedTodo(todo.id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={onSubmitChangingTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitleField}
              onChange={(event) => setTodoTitleField(event.target.value)}
              onBlur={onSubmitChangingTitle}
              onKeyDown={cancelEditing}
              ref={titleTodoField}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

import {
  memo, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
  isDeleting: boolean,
  updatingTodo: (todo: Todo) => void,
  isUpdating: boolean
};

export const TodoInfo: React.FC <Props> = memo(({
  todo,
  removeTodo,
  isLoading,
  updatingTodo,
  isUpdating,
  isDeleting,
}) => {
  const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing === true) {
      todoTitleField.current?.focus();
    }
  }, [isEditing]);

  const handlePressKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTodoTitle(todo.title);
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (editingTodoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (editingTodoTitle === '') {
      setEditingTodoTitle('');
      removeTodo(todo.id);

      return;
    }

    if (editingTodoTitle !== todo.title) {
      setIsEditing(true);
      updatingTodo({
        ...todo,
        title: editingTodoTitle,
      });
    }

    setIsEditing(false);
  };

  const isSaving = todo.id === 0 || isUpdating || isDeleting;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => updatingTodo({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={todoTitleField}
              className="todo__title-field"
              value={editingTodoTitle}
              placeholder="Emty todo will be deleted"
              onChange={(event) => setEditingTodoTitle(event.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handlePressKey}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      { isSaving && (
        <Loader
          isLoading={isLoading}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
});

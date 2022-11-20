import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useInput } from '../../utils/useInput';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  handleEditTodo: (todoId:number, title: string) => Promise<void>;
};

export const TodoData: React.FC<Props> = React.memo(({
  todo,
  handleDeleteTodo,
  changingTodosId,
  handleToggleTodo,
  handleEditTodo,
}) => {
  const editTodoField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { value, onChange, cancelChange } = useInput(todo.title);

  const { id, title, completed } = todo;

  // const startValue = title;

  useEffect(() => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [isEditing]);

  const handleEditing = (input: boolean) => {
    setIsEditing(input);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelChange(title);
      setIsEditing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditing(true);
    const newValue = value.trim();

    if (newValue !== title) {
      await handleEditTodo(id, value);
    }

    handleEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleToggleTodo(id, completed)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              ref={editTodoField}
              type="text"
              className="todoapp__new-todo todo__title"
              placeholder="Empty todo will be deleted"
              value={value}
              onChange={onChange}
              onKeyDown={handleEscape}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      {changingTodosId.includes(id) && <Loader />}
    </div>
  );
});

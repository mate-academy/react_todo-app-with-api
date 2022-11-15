import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useInput } from '../../utils/useInput';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => void;
  handleEditTodo: (todoId:number, title: string) => void;
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

  const { value, onChange } = useInput(todo.title);

  const { id, title, completed } = todo;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  }, [isEditing]);

  const handleEditing = (input: boolean) => {
    setIsEditing(input);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditing(true);
    if (value !== title) {
      handleEditTodo(id, value);
      handleEditing(false);
    } else {
      handleEditing(false);
    }
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
              placeholder={value || 'Empty todo will be deleted'}
              value={value}
              onChange={onChange}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
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

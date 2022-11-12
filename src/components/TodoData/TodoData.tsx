import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
// import { EditTodoForm } from '../EditTodoForm';
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
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [titleEditTodo, setTitleEditTodo] = useState(todo.title);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditing]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitleEditTodo(event.target.value);
  };

  const handleEditing = (value: boolean) => {
    setIsEditing(value);
  };

  const { id, title, completed } = todo;

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
            onSubmit={(event) => {
              event.preventDefault();
              handleEditing(true);
              if (titleEditTodo !== title) {
                handleEditTodo(todo.id, titleEditTodo);
                handleEditing(false);
              } else {
                handleEditing(false);
              }
            }}
            onBlur={() => {
              if (titleEditTodo !== title) {
                handleEditing(true);

                handleEditTodo(todo.id, titleEditTodo);
                handleEditing(false);
              }
            }}
          >
            <input
              data-cy="NewTodoField"
              ref={newTodoField}
              type="text"
              className="todoapp__new-todo todo__title"
              value={titleEditTodo}
              onChange={event => handleInput(event)}
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

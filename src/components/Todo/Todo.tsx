import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  todoDelete: (todo: Todo) => void;
  visibleLoader: boolean;
  updateCompleteTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, title: string) => void;
  newTodoId: number;
};

export const UserTodo: React.FC<Props> = ({
  todo,
  todoDelete,
  visibleLoader,
  updateCompleteTodo,
  updateTodoTitle,
  newTodoId,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);

  const addCompleteTodo = () => {
    updateCompleteTodo(todo);
  };

  const handleUpdateTodo = () => {
    if (title === '') {
      todoDelete(todo);
    } else {
      updateTodoTitle(todo, title);
    }

    setIsClicked(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      onDoubleClick={() => setIsClicked(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={addCompleteTodo}
          disabled={visibleLoader}
        />
      </label>

      {
        isClicked
          ? (
            <form
              onSubmit={handleUpdateTodo}
            >
              <input
                type="text"
                value={title}
                className="todo__title-field"
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                onBlur={handleUpdateTodo}
              />
            </form>
          )
          : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>
          )
      }
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          todoDelete(todo);
        }}
      >
        ×
      </button>

      {
        visibleLoader && newTodoId === todo.id
          ? (
            <Loader />
          )
          : ''
      }
    </div>
  );
};

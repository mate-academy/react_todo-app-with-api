import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  deleteTodo: (todo: Todo) => void;
  visibleLoader: boolean;
  setVisibleLoader: (loader: boolean) => void;
  updateCompleteTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, title: string) => void;
};

export const UserTodo: React.FC<Props> = ({
  todo,
  deleteTodo,
  visibleLoader,
  setVisibleLoader,
  updateCompleteTodo,
  updateTodoTitle,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);

  const addCompleteTodo = () => {
    updateCompleteTodo(todo);
  };

  const handleUpdateTodo = () => {
    updateTodoTitle(todo, title);

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
        />
      </label>

      {
        isClicked
          ? (
            <form onSubmit={handleUpdateTodo}>
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
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
          setVisibleLoader(true);

          return deleteTodo({
            title: todo.title,
            userId: todo.userId,
            id: todo.id,
            completed: todo.completed,
          });
        }}
      >
        ×
      </button>

      {visibleLoader && (
        <Loader />
      )}
    </div>
  );
};

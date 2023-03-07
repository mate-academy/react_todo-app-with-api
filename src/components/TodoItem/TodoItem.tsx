import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoRename } from '../TodoInput';

type Props = {
  todo: Todo,
  deleteTodo: () => void,
  toggleStatusTodo: () => void,
  renameTodo: (todo: Todo, newTitle: string) => void,
  loadableTodos: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleStatusTodo,
  renameTodo,
  loadableTodos,
}) => {
  const [isRenamed, setIsRenamed] = useState(false);

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={toggleStatusTodo}
        />
      </label>

      {isRenamed ? (
        <TodoRename
          todo={todo}
          setIsRenamed={setIsRenamed}
          deleteTodo={deleteTodo}
          renameTodo={renameTodo}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsRenamed(!isRenamed)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active':
            !todo.id || loadableTodos.includes(todo.id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

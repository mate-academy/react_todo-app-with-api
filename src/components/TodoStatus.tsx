/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onUpdate: (todos: Todo[]) => void;
};

export const TodoStatus: React.FC<Props> = React.memo(({ todo, onUpdate }) => {
  return (
    <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => {
          const { id, userId, title, completed } = todo;

          onUpdate([{ id, userId, title, completed: !completed }]);
        }}
      />
    </label>
  );
});

TodoStatus.displayName = 'TodoStatus';

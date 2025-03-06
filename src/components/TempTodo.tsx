import React from 'react';
import { TodoLoader } from './TodoLoader';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  tempTodo: Todo;
  loadingTodoIds: Set<number>;
};

export const TempTodo: React.FC<Props> = ({ tempTodo, loadingTodoIds }) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: tempTodo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todoStatus-${tempTodo.id}`}
        aria-labelledby={`todoStatus-${tempTodo.id}`}
      >
        <input
          id={`todoStatus-${tempTodo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <TodoLoader loadingTodoIds={loadingTodoIds} todoId={0} />
    </div>
  );
};

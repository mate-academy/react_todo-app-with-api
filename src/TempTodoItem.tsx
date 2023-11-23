import React from 'react';
import cn from 'classnames';
import { TempTodoItemProps } from './types/TempTodoItemProps';

export const TempTodoItem: React.FC<TempTodoItemProps> = ({ tempTodo }) => {
  return (
    <div
      key={tempTodo.id}
      data-cy="Todo"
      className={cn('todo', { completed: tempTodo.completed })}
    >
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
      />
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {tempTodo.title}
      </span>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': tempTodo })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

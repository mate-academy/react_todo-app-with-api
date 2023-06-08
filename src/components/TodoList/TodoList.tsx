import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  onDeleteTodo(id: number): void,
  isUpdating: number[],
  tempTodo: Todo | null,
  onToggleStatus(id: number, completed: boolean): Promise<void>,
  isToggleAll: boolean,
  onTitleChange(id: number, title: string): Promise<void>,
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onDeleteTodo,
  isUpdating,
  tempTodo,
  onToggleStatus,
  isToggleAll,
  onTitleChange,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isUpdating={isUpdating}
          onToggleStatus={onToggleStatus}
          isToggleAll={isToggleAll}
          onTitleChange={onTitleChange}
        />
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>
          <div className={classNames('modal overlay',
            { 'is-active': tempTodo !== null })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

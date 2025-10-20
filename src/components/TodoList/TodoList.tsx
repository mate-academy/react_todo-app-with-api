/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoIds,
  updatingTodoIds,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isDeleting={false}
          isUpdating={false}
          onDelete={() => {}}
          onToggle={() => {}}
          isTemp
        />
      )}
    </section>
  );
};

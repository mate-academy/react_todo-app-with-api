/* eslint-disable prettier/prettier */

import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  deletingIds: number[];
  updatingIds: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  onUpdate: (todoId: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  updatingIds,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={
            deletingIds.includes(todo.id) ||
            updatingIds.includes(todo.id)
          }
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
};

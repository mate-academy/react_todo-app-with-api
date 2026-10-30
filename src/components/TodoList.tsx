import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  deletingIds: number[];
  updatingIds: number[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, fields: Partial<TodoType>) => Promise<void>;
  tempTodo: TodoType | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  updatingIds,
  onDelete,
  onUpdate,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isDeleting={deletingIds.includes(todo.id)}
          isUpdating={updatingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          isDeleting={false}
          isUpdating={true}
          onDelete={() => Promise.resolve()}
          onUpdate={() => Promise.resolve()}
        />
      )}
    </section>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number[]) => Promise<void>;
  tempTodo: Todo | null;
  deletedIds: number[];
  adding: boolean;
  onUpdate: (el: Todo[]) => Promise<void>;
  errorMsg: string;
  updatingIds: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletedIds,
  tempTodo,
  adding,
  onUpdate,
  updatingIds,
  errorMsg,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          updatingIds={updatingIds}
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletedIds={deletedIds}
          onUpdate={onUpdate}
          errorMsg={errorMsg}
        />
      ))}

      {tempTodo && (
        <TodoItem
          updatingIds={updatingIds}
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          deletedIds={deletedIds}
          adding={adding}
          errorMsg={errorMsg}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};

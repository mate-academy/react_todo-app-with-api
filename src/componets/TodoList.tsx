import React from 'react';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { Todo } from '../types/todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
  onUpdateChange: (todo: Todo) => Promise<void | never>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onUpdateChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdateChange}
        />
      ))}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

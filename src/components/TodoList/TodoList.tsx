import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  processings: number[];
  onDelete: (id: number) => void;

  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  processings,
  onDelete,

  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processings.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};

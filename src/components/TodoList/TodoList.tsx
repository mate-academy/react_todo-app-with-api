import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  loading: number[];
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onUpdate,
  onDelete,
  tempTodo,
}) => {
  const visibleTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <div>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </div>
  );
};

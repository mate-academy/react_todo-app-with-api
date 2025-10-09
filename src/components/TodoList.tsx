import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDeletedTodo: (id: number) => Promise<void>;
  completedTodos: Todo[];
  onToggle: (todo: Todo) => void;
  loadingTodoIds: number[];
  onEditingTodo: (id: number, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  onDeletedTodo,
  onToggle,
  loadingTodoIds,
  onEditingTodo,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeletedTodo={onDeletedTodo}
          onToggle={onToggle}
          loadingTodoIds={loadingTodoIds}
          onEditingTodo={onEditingTodo}
        />
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </>
  );
};

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo !== null && <TodoItem todo={tempTodo} isProcessed />}
    </section>
  );
};

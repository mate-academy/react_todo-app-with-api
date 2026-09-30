import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  processingTodoIds: number[];
  onDelete: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingTodoIds,
  onDelete,
  onToggle,
  onRename,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      const isProcessing = processingTodoIds.includes(todo.id);

      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isProcessing}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      );
    })}
  </section>
);

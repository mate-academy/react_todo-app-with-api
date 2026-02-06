import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  processingTodoIds: number[];
  onRename?: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  processingTodoIds,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          loading={processingTodoIds.includes(todo.id)}
          onRename={onRename}
        />
      ))}
    </section>
  );
};

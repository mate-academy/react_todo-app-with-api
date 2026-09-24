import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  onToggle: (todoId: number) => void;
  onRename: (todoId: number, title: string) => Promise<void>;
  processingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onRename,
  processingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          isProcessed={processingTodos.includes(todo.id)}
        />
      ))}
    </section>
  );
};

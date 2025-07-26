import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number, onSuccess?: VoidFunction) => Promise<void>;
  loadingTodoIds: number[];
  onStatusChange: (todoId: number, newStatus: boolean) => void;
  renameCallback: (
    todoId: number,
    newTitle: string,
    onSuccess?: VoidFunction,
  ) => Promise<void>;
  isTemp?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  onStatusChange,
  renameCallback,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isProcessed={loadingTodoIds.includes(todo.id)}
          onStatusChange={onStatusChange}
          renameCallback={renameCallback}
          isTemp={false}
        />
      ))}
    </section>
  );
};

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
  updatingTodoIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onRename: (todoId: number, newTitle: string) => void;
  disabled: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  isLoading,
  updatingTodoIds,
  tempTodo,
  onDelete,
  disabled,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          isLoading={isLoading}
          updatingTodoIds={updatingTodoIds}
          onDelete={onDelete}
          disabled={disabled}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          toggleTodo={() => {}}
          isLoading={isLoading}
          updatingTodoIds={updatingTodoIds}
          onDelete={() => {}}
          disabled={disabled}
          onRename={onRename}
        />
      )}
    </section>
  );
};

import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isLoading: number[];
  onUpdateTodo: (updatedTodo: Todo) => void;
  updateToggle: (toggleTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoading,
  onUpdateTodo,
  updateToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isIncludesId = isLoading.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isLoadingTodo={isIncludesId}
            onUpdateTodo={onUpdateTodo}
            updateToggle={updateToggle}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoadingTodo={isLoading.includes(0)}
          onDelete={onDelete}
          updateToggle={updateToggle}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};

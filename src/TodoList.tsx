import React from 'react';
import { TodoItem } from './TodoItem';
import { TodoListProps } from './types/TodoListProps';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  setError,
  tempTodo,
  loadingTodo,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setError={setError}
          loadingTodo={loadingTodo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          setError={setError}
          loadingTodo={loadingTodo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      )}
    </section>
  );
};

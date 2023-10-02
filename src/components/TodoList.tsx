import React from 'react';
import { TodoListProps } from '../types/TodoList';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  handleTodoDelete,
  handleTodoToggle,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading[todo.id]}
          handleTodoDelete={handleTodoDelete}
          handleTodoToggle={handleTodoToggle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleTodoToggle={handleTodoToggle}
          handleTodoDelete={handleTodoDelete}
          isLoading={isLoading[tempTodo.id]}
        />
      )}
    </section>
  );
};

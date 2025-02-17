import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodos: Record<number, boolean>;
  isActive: number | null;
  setIsActive: (id: number | null) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  onToggle: (updatedTodo: Todo) => void;
  handleEditTodoTitle: (id: number, title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodos,
  isActive,
  setIsActive,
  onDelete,
  tempTodo,
  onToggle,
  handleEditTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={!!loadingTodos[todo.id]}
          isActive={isActive}
          setIsActive={setIsActive}
          onDelete={onDelete}
          onToggle={onToggle}
          handleEditTodoTitle={handleEditTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          loading={true}
          isActive={isActive}
          setIsActive={setIsActive}
          onDelete={onDelete}
          onToggle={onToggle}
          handleEditTodoTitle={handleEditTodoTitle}
        />
      )}
    </section>
  );
};

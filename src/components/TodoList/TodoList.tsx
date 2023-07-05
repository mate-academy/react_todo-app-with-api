import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  visibleTodos: Todo[],
  loadingTodosId: number[],
  handleDeleteTodo: (todoId: number) => void,
  handleTodoUpdate: (todoId: number, data: any) => void,
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  loadingTodosId,
  handleDeleteTodo,
  handleTodoUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodosId={loadingTodosId}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoUpdate={handleTodoUpdate}
        />
      ))}
    </section>
  );
};

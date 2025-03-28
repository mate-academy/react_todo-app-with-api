import { Todo } from '../../types/Todo';
import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';

export interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
  onUpdateTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, onSuccess?: VoidFunction) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  isLoading,
  deleteTodo,
  loadingTodoIds,
  onUpdateTodo,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/*This is a completed todo */}
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            isLoading={loadingTodoIds.includes(todo.id)}
            onUpdateTodo={onUpdateTodo}
            updateTodoTitle={updateTodoTitle}
          />
        );
      })}
      {tempTodo !== null && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isLoading}
          onUpdateTodo={onUpdateTodo}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};

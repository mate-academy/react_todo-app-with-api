import React from 'react';
import { Todo } from '../todo.component/todo.types';
import { TodoComponent } from '../todo.component/todo.component';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  filteredTodos: Todo[];
  handleTodoChange: (updatedTodo: Partial<Todo> & { id: number }) => void;
  handleDeleteTodo: (deletedTodoId: number) => void;
  handleError: (errorMessage: string) => void;
  isLoadingAll: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  tempTodo,
  filteredTodos,
  handleTodoChange,
  handleDeleteTodo,
  handleError,
  isLoadingAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoComponent
          key={todo.id}
          todo={todo}
          onTodoChange={handleTodoChange}
          onDeleteTodo={handleDeleteTodo}
          onError={handleError}
          isExternalLoading={isLoadingAll}
        />
      ))}
      {tempTodo && (
        <TodoComponent
          todo={tempTodo}
          isTemp={true}
          onTodoChange={handleTodoChange}
          onError={handleError}
          onDeleteTodo={handleDeleteTodo}
          isExternalLoading={isLoadingAll}
        />
      )}
    </section>
  );
};

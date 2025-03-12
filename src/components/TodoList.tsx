import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  newTodo: string;
  setNewTodo: (newTodo: string) => void;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  selectTodoId: number | null;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  updateTodo: (updatedTodo: Todo) => void;
  loaderUptadeTodo: number | null;
  selectTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  deleteTodo,
  tempTodo,
  isLoading,
  selectTodoId,
  editingTodoId,
  setEditingTodoId,
  updateTodo,
  loaderUptadeTodo,
  selectTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          updateTodo={updateTodo}
          selectTodoId={selectTodoId}
          deleteTodo={deleteTodo}
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          setEditingTodoId={setEditingTodoId}
          editingTodoId={editingTodoId}
          loaderUptadeTodo={loaderUptadeTodo}
          selectTodoIds={selectTodoIds}
        />
      ))}
      {tempTodo && (
        <TodoItem
          updateTodo={updateTodo}
          selectTodoId={selectTodoId}
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isLoading}
          deleteTodo={() => {}}
          setEditingTodoId={setEditingTodoId}
          editingTodoId={editingTodoId}
          loaderUptadeTodo={loaderUptadeTodo}
          selectTodoIds={selectTodoIds}
        />
      )}
    </section>
  );
};

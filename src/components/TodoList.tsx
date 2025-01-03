import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  setError: (message: string) => void;
  loading: number | null;
  deleteTodo: (id: number) => Promise<void> | void;
  updateTodoCheck: (id: number) => void;
  updateTodoTitle: (id: number, value: string) => Promise<void> | void;
  tempTodo: Todo | null;
  isEditingId: number | null;
  setIsEditingId: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  setError,
  loading,
  deleteTodo,
  updateTodoCheck,
  updateTodoTitle,
  tempTodo,
  isEditingId,
  setIsEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setError={setError}
          loading={loading}
          deleteTodo={deleteTodo}
          updateTodoCheck={updateTodoCheck}
          updateTodoTitle={updateTodoTitle}
          isEditingId={isEditingId}
          setIsEditingId={setIsEditingId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          setError={setError}
          loading={loading}
          deleteTodo={deleteTodo}
          updateTodoCheck={updateTodoCheck}
          updateTodoTitle={updateTodoTitle}
          isEditingId={isEditingId}
          setIsEditingId={setIsEditingId}
        />
      )}
    </section>
  );
};

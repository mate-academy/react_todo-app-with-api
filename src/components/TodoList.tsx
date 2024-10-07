import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  isAddingTodo: boolean;
  onUpdateStatus: (id: number, completed: boolean) => void;
  updatingTodoId: number | null;
  onUpdateTitle: (id: number, newTitle: string) => Promise<void>;
  isEditing?: number | null;
  setError: (error: string | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deletingTodoId,
  tempTodo,
  onDeleteTodo,
  isAddingTodo,
  onUpdateStatus,
  updatingTodoId,
  onUpdateTitle,
  setError,
 }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
        key={todo.id}
        todo={todo}
        deletingTodoId={deletingTodoId}
        onDeleteTodo={onDeleteTodo}
        onUpdateStatus={onUpdateStatus}
        isUpdating={updatingTodoId === todo.id}
        onUpdateTitle={onUpdateTitle}
        setError={setError}
        />
      ))}

       {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletingTodoId={deletingTodoId}
          isAddingTodo={isAddingTodo}
          onUpdateStatus={onUpdateStatus}
          onUpdateTitle={onUpdateTitle}
          setError={setError}
        />
      )}
    </section>
  );
};

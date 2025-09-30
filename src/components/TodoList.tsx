import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onEditTodo: (id: number) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  onToggleTodo,
  onDeleteTodo,
  editingId,
  setEditingId,
  onEditTodo,
  editTitle,
  setEditTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          isEditing={editingId === todo.id}
          onSetEditingId={setEditingId}
          onEdit={onEditTodo}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
        />
      ))}
    </section>
  );
};

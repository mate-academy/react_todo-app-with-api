import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
type Props = {
  filterdTodos: Todo[];
  onToggle: (value: number, valueq: boolean) => void;
  onDelete: (value: number) => Promise<boolean>;
  deletingTodoId: number | null;
  updatingTodoId: number | null;
  listOfUpdatedTodos: number[];
  editingTodoId: number | null;
  onEdit: (value: number | null) => void;
  onEditing: (value: number, value1: string) => Promise<boolean>;
};

export const TodoList = ({
  filterdTodos,
  onToggle,
  onDelete,
  deletingTodoId,
  updatingTodoId,
  listOfUpdatedTodos,
  editingTodoId,
  onEdit,
  onEditing,
}: Props) => {
  return (
    <>
      {filterdTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          deletingTodoId={deletingTodoId}
          updatingTodoId={updatingTodoId}
          listOfUpdatedTodos={listOfUpdatedTodos}
          editingTodoId={editingTodoId}
          onEdit={onEdit}
          onEditing={onEditing}
        />
      ))}
    </>
  );
};

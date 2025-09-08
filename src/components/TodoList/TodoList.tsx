import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  handleDelete: (todo: Todo) => void;
  deletingIds: number[];
  handleToggle: (todo: Todo) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleChangeTodo: (todo: Todo, newTitle: string) => boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  deletingIds,
  handleToggle,
  editingId,
  setEditingId,
  editingTitle,
  setEditingTitle,
  handleChangeTodo,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          deletingIds={deletingIds}
          handleToggle={handleToggle}
          editingId={editingId}
          setEditingId={setEditingId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          handleChangeTodo={handleChangeTodo}
        />
      ))}
    </>
  );
};

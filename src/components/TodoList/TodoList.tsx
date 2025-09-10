import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  editingId: number | null;
  editingTitle: string;
  processedIds: number[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStartEditing: (todo: Todo) => void;
  onRename: (todo: Todo) => void;
  setEditingTitle: (title: string) => void;
  setEditingId: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  editingId,
  editingTitle,
  processedIds,
  tempTodo,
  isAdding,
  onToggle,
  onDelete,
  onStartEditing,
  onRename,
  setEditingTitle,
  setEditingId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        editingId={editingId}
        editingTitle={editingTitle}
        processedIds={processedIds}
        tempTodo={tempTodo}
        isAdding={isAdding}
        onToggle={onToggle}
        onDelete={onDelete}
        onStartEditing={onStartEditing}
        onRename={onRename}
        setEditingTitle={setEditingTitle}
        setEditingId={setEditingId}
      />
    ))}
  </section>
);

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  editingTodoId: number | null;
  editTitle: string;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  onRename: (id: number, newTitle: string) => void;
  setEditingTodoId: (id: number | null) => void;
  setEditTitle: (title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  editingTodoId,
  editTitle,
  onDelete,
  onUpdate,
  onRename,
  setEditingTodoId,
  setEditTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          editTitle={editTitle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onRename={onRename}
          setEditingTodoId={setEditingTodoId}
          setEditTitle={setEditTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          isEditing={false}
          editTitle=""
          onDelete={() => {}}
          onUpdate={() => {}}
          onRename={() => {}}
          setEditingTodoId={() => {}}
          setEditTitle={() => {}}
        />
      )}
    </section>
  );
};

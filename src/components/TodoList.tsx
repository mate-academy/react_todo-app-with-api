import React from 'react';
import { Todo } from './Todo';
import { Todo as TodoType } from '../types/Todo';

interface Props {
  todos: TodoType[];
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  currentTodo: TodoType | null;
  tempTodo: TodoType | null;
  onToggle: (todo: TodoType) => void;
  onDelete: (id: number) => void;
  onRename: (todo: TodoType, newTitle: string) => void;
  onStartEdit: (todo: TodoType) => void;
  onCancelEdit: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  updatingTodoIds,
  currentTodo,
  tempTodo,
  onToggle,
  onDelete,
  onRename,
  onStartEdit,
  onCancelEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          isEditing={currentTodo?.id === todo.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          isDeleting={false}
          isUpdating={true}
          isEditing={false}
          onToggle={() => {}}
          onDelete={() => {}}
          onRename={() => {}}
          onStartEdit={() => {}}
          onCancelEdit={() => {}}
        />
      )}
    </section>
  );
};

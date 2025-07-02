/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodoId: number | null;
  onDelete: (id: number) => void;
  onChange: (id: number, completed: boolean) => void;
  editingTodoId: number | null;
  editingTitle: string;
  onEditStart: (todo: Todo) => void;
  onEditCancel: () => void;
  onEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSubmit: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  processingTodoId,
  onDelete,
  onChange,
  editingTodoId,
  editingTitle,
  onEditStart,
  onEditCancel,
  onEditChange,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingTodoId === todo.id}
          onDelete={onDelete}
          onChange={onChange}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onEditChange={onEditChange}
          onEditSubmit={onEditSubmit}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isProcessing={true}
          onDelete={() => {}}
          onChange={() => {}}
          disabled
        />
      )}
    </section>
  );
};

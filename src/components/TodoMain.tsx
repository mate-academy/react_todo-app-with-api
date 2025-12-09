import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoMainProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
  processingIds?: number[];

  /* Editing API */
  editingId: number | null;
  editingTitle: string;
  startEditing: (id: number, title: string) => void;
  changeEditingTitle: (value: string) => void;
  cancelEditing: () => void;
  submitEditing: () => void;
}

export const TodoMain: React.FC<TodoMainProps> = ({
  todos,
  tempTodo,
  onUpdateTodo,
  onDeleteTodo,
  processingIds = [],

  editingId,
  editingTitle,
  startEditing,
  changeEditingTitle,
  cancelEditing,
  submitEditing,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todoapp__list" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
            isProcessing={processingIds.includes(todo.id)}
            /* editing props */
            editingId={editingId}
            editingTitle={editingTitle}
            startEditing={startEditing}
            changeEditingTitle={changeEditingTitle}
            cancelEditing={cancelEditing}
            submitEditing={submitEditing}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key="temp"
            todo={tempTodo}
            onUpdate={() => {}}
            onDelete={() => {}}
            isProcessing={true}
            isTemporary={true}
            /* editing props */
            editingId={editingId}
            editingTitle={editingTitle}
            startEditing={startEditing}
            changeEditingTitle={changeEditingTitle}
            cancelEditing={cancelEditing}
            submitEditing={submitEditing}
          />
        )}
      </ul>
    </section>
  );
};

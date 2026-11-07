import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodos: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  processingTodos,
  editingTodoId,
  editingTitle,
  onToggle,
  onDelete,
  onStartEditing,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingTodos.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEditing={onStartEditing}
          onEditTitleChange={onEditTitleChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temporary-todo"
          todo={tempTodo}
          isProcessing={false}
          isEditing={false}
          editingTitle=""
          isTemporary
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEditing={onStartEditing}
          onEditTitleChange={onEditTitleChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      )}
    </section>
  );
};

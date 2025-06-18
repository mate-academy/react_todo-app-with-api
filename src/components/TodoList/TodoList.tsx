import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  onToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  editingTodoId: number | null;
  editingTitle: string;
  onStartEdit: (todoId: number, title: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (todoId: number, title: string) => Promise<void>;
  setEditingTitle: (title: string) => void;
  processingTodoIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  onToggleTodo,
  editingTodoId,
  editingTitle,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  setEditingTitle,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isProcessing = processingTodoIds.includes(todo.id);
        const isEditing = todo.id === editingTodoId;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onToggleTodo={onToggleTodo}
            isEditing={isEditing}
            editingTitle={editingTitle}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            setEditingTitle={setEditingTitle}
            processingWithTodos={isProcessing}
          />
        );
      })}
    </section>
  );
};

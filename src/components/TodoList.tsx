import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  todoIsLoading: { [id: number]: boolean };
  tempTitles: { [id: number]: string };
  tempStatuses: { [id: number]: boolean };
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  onToggleTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo, isFromTitleEdit: boolean) => void;
  onDeleteTodo: (
    todoId: number,
    fromTitleEdit: boolean,
    originalTitle: string,
  ) => void;
  setEditingTodoId: (id: number | null) => void;
  isCreating: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  tempTodo,
  todoIsLoading,
  tempTitles,
  tempStatuses,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
  setEditingTodoId,
  isCreating,
}) => {
  const handleStartEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={todoIsLoading[todo.id] || false}
          tempTitle={tempTitles[todo.id]}
          tempStatus={tempStatuses[todo.id]}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          onToggle={onToggleTodo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          setEditingTitle={setEditingTitle}
          isCreating={isCreating}
        />
      ))}

      {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
    </section>
  );
};

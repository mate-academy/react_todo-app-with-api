import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { FilterType } from './Filter';

interface TodoListProps {
  todos: TodoType[];
  filter: FilterType;
  tempTodo?: TodoType | null;
  processingIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEditStart: (todo: TodoType) => void;
  onEditChange: (value: string) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
  onEditBlur: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  processingIds,
  editingTodoId,
  editingTitle,
  onDelete,
  onToggle,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onEditBlur,
}) => {
  const getFilteredTodos = () => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onStartEdit={() => onEditStart(todo)}
          onEditChange={onEditChange}
          onEditSubmit={() => onEditSave(todo.id)}
          onEditCancel={onEditCancel}
          onEditBlur={() => onEditBlur(todo.id)}
          isEditing={editingTodoId === todo.id}
          editValue={editingTodoId === todo.id ? editingTitle : todo.title}
          isProcessed={processingIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <Todo
          key="temp"
          todo={tempTodo}
          onToggle={() => {}}
          isProcessed
        />
      )}
    </section>
  );
};

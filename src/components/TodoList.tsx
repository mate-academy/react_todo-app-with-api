import React from 'react';
import { Todo, TodoItem } from './TodoItem';

interface EditingProps {
  editingTodoId: number | null;
  newTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

interface Handlers {
  onToggleTodo: (id: number) => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (id: number) => void;
  onSaveTitle: (id: number) => void;
  onChangeNewTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TodoListProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  loading: boolean;
  deletingTodoIds: number[];
  updatingTodoId: number | null;
  batchUpdatingIds: number[];
  editing: EditingProps;
  handlers: Handlers;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo = null,
  deletingTodoIds,
  updatingTodoId,
  batchUpdatingIds,
  editing,
  handlers,
}) => {
  const renderTodoItem = (todo: Todo) => {
    const isTemp = tempTodo !== null && todo.id === tempTodo.id;
    const isLoading =
      isTemp ||
      deletingTodoIds.includes(todo.id) ||
      updatingTodoId === todo.id ||
      batchUpdatingIds.includes(todo.id);

    const handleToggle = () => {
      handlers.onToggleTodo(todo.id);
    };

    const handleEdit = () => {
      handlers.onEditTodo(todo);
    };

    const handleDelete = () => {
      handlers.onDeleteTodo(todo.id);
    };

    const handleBlur = () => {
      if (editing.newTitle.trim() === '') {
        handlers.onDeleteTodo(todo.id);
      } else {
        handlers.onSaveTitle(todo.id);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlers.onSaveTitle(todo.id);
      }
    };

    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        isEditing={editing.editingTodoId === todo.id}
        newTitle={editing.newTitle}
        inputRef={editing.inputRef}
        loading={isLoading}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onChange={handlers.onChangeNewTitle}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDelete={handleDelete}
        disabled={
          editing.editingTodoId === todo.id && updatingTodoId === todo.id
        }
      />
    );
  };

  return (
    <section className="todo__main" data-cy="TodoList">
      <div>
        {todos.map(todo => {
          return renderTodoItem(todo);
        })}
      </div>
    </section>
  );
};

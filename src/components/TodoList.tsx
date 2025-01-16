import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  editingId: number | null;
  handleDeleteTodo: (todoId: number) => void;
  handleCancelRename: () => void;
  startEditing: (todoId: number) => void;
  handleUpdateTodo: (todoId: number, newTitle: string) => void;
  handleToggleStatus: (todoId: number, completed: boolean) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingIds,
  handleDeleteTodo,
  handleCancelRename,
  startEditing,
  handleUpdateTodo,
  editingId,
  handleToggleStatus,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <div>
      {[...todos, tempTodo]
        .filter((todo): todo is Todo => Boolean(todo))
        .map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            isEditing={editingId === todo.id}
            handleDeleteTodo={handleDeleteTodo}
            startEditing={startEditing}
            handleUpdateTodo={handleUpdateTodo}
            handleCancelRename={handleCancelRename}
            handleToggleStatus={handleToggleStatus}
          />
        ))}
    </div>
  </section>
);

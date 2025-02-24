import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (id: number) => void;
  onRenameTodo: (id: number, newTitle: string) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onToggleTodo,
  onRenameTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onToggle={onToggleTodo}
          onRename={onRenameTodo}
          loadingIds={loadingIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDeleteTodo}
          onToggle={onToggleTodo}
          onRename={onRenameTodo}
          loadingIds={[tempTodo.id]}
        />
      )}
    </section>
  );
};

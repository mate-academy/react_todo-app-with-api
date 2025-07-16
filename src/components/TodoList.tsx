import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  allTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoId: number | null;
  togglingTodoIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onToggleAll: () => void;
  isLoading: boolean;
  renamingTodoIds?: number[];
  onRename: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  allTodos,
  tempTodo,
  deletingTodoId,
  togglingTodoIds,
  onDelete,
  onToggle,
  onToggleAll,
  isLoading,
  onRename,
  renamingTodoIds = [],
}) => {
  const allCompleted =
    allTodos.length > 0 && allTodos.every(todo => todo.completed);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.length > 0 && !isLoading && (
        <>
          <input
            data-cy="ToggleAllButton"
            type="checkbox"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            id="toggle-all"
            checked={allCompleted}
            onChange={onToggleAll}
          />
        </>
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoId === todo.id}
          togglingTodoIds={togglingTodoIds}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          renamingTodoIds={renamingTodoIds}
        />
      ))}

      {tempTodo && <TodoItem key="temp" todo={tempTodo} isTemp />}
    </section>
  );
};

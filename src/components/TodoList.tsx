import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export type Props = {
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  loadingTodoId: number[];
  tempTodo: Todo | null;
  visibleTodos: Todo[];
};
export const TodoList: React.FC<Props> = ({
  onDelete,
  onUpdate,
  loadingTodoId,
  tempTodo,
  visibleTodos,
}) => {
  const handleUpdate = (todo: Todo, newTitle: string) => {
    onUpdate({ ...todo, title: newTitle });
  };

  const handleToggle = (todo: Todo) => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const isLoading = loadingTodoId.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={() => onDelete(todo.id)}
            onToggle={() => handleToggle(todo)}
            onUpdate={newTitle => handleUpdate(todo, newTitle)}
            loading={isLoading}
          />
        );
      })}

      {tempTodo && (
        <TodoItem todo={tempTodo} loading={loadingTodoId.includes(0)} />
      )}
    </section>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  loadingTodoIds: number[],
  onToggle: (todo: Todo) => void,
  onUpdate: (todoId: number, newTodoTitle: string) => void,
  onDelete: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  loadingTodoIds,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

    </section>
  );
});

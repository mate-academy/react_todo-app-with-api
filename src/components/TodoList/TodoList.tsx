import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../ErrorMessage/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  onDeleteTodo: (id: number) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
  onToggleStatus: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  onDeleteTodo,
  onUpdateTitle,
  onToggleStatus,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const isLoading = deletingTodoIds.includes(todo.id)
          || updatingTodoIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            onDeleteTodo={onDeleteTodo}
            onUpdateTitle={onUpdateTitle}
            onToggleStatus={onToggleStatus}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isLoading
          onDeleteTodo={onDeleteTodo}
          onUpdateTitle={onUpdateTitle}
          onToggleStatus={onToggleStatus}
        />
      )}
    </section>
  );
});

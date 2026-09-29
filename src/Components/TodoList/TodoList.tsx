import React from 'react';
import { Todo } from '../Todo/Todo';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  loadingTodoIds: number[];
  onDelete: (todoId: number) => Promise<void>;
  onToggle: (todo: TodoType) => Promise<void>;
  onRename: (todo: TodoType, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          isLoading={true}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      )}
    </section>
  );
};

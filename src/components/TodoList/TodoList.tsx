import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  activeTodosId: number[];
  temporaryTodo: Todo | null;
  onDelete: (id: number) => void;
  isDeleteDisabled: boolean | null | 0;
  onCheckedChange: (todoId: number, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  activeTodosId,
  temporaryTodo,
  onDelete,
  isDeleteDisabled,
  onCheckedChange,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        onDelete={onDelete}
        isDeleteDisabled={isDeleteDisabled}
        isLoading={activeTodosId.some(activeId => activeId === todo.id)}
        onCheckedChange={onCheckedChange}
        key={todo.id}
      />
    ))}

    {temporaryTodo && (
      <TodoInfo
        todo={temporaryTodo}
        onDelete={onDelete}
        isDeleteDisabled
        isLoading={!!temporaryTodo}
        onCheckedChange={onCheckedChange}
      />
    )}
  </section>
);

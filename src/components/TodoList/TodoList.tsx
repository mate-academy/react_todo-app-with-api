import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  activeTodosId: number[];
  temporaryTodo: Todo | null;
  onDelete: (id: number) => void;
  onStatusChange: (todoId: number, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  activeTodosId,
  temporaryTodo,
  onDelete,
  onStatusChange,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        onDelete={onDelete}
        isLoading={activeTodosId.some(activeId => {
          return activeId === todo.id;
        })}
        onStatusChange={onStatusChange}
        key={todo.id}
      />
    ))}

    {temporaryTodo && (
      <TodoInfo
        todo={temporaryTodo}
        onDelete={onDelete}
        isLoading={!!temporaryTodo}
        onStatusChange={onStatusChange}
      />
    )}
  </section>
);

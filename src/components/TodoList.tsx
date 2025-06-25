import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  loadingTodoId: number | null;
  onUpdate: (todo: Omit<Todo, 'userId'>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoId,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <ul>
      {todos.map(({ id, title, completed }) => (
        <TodoItem
          key={id}
          id={id}
          title={title}
          completed={completed}
          onDelete={onDelete}
          loadingTodoId={loadingTodoId}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  </section>
);

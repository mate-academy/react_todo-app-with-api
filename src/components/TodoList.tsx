import { memo } from 'react';

import { ErrorMessage, Todo } from '../types';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[]
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (todo: Todo) => Promise<void>;
  onEdit: (todo: Todo, title: string) => Promise<void>;
  onError: (message: ErrorMessage) => void;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  processingIds,
  onToggle,
  onDelete,
  onEdit,
  onError,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onError={onError}
        processing={processingIds.includes(todo.id)}
      />
    ))}

    {tempTodo && (
      <TodoItem todo={tempTodo} processing />
    )}
  </section>
));

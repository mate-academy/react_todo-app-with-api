import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  processingId: number[];
  onUpdate?: (id: number, data: { title: string }) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  onDelete,
  onToggle,
  processingId,
  onUpdate,
}) => {
  return (
    <section
      className={classNames('todoapp__main', { hidden: todos?.length === 0 })}
      data-cy="TodoList"
    >
      {!isLoading &&
        todos?.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            isSubmitting={processingId.includes(todo.id)}
            onDelete={onDelete}
            onToggle={onToggle}
            onUpdate={onUpdate}
          />
        ))}
    </section>
  );
};

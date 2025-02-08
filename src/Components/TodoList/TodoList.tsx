import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isSubmitting: boolean;
  isDeleting?: Todo | undefined;
  isUpdating?: Todo[] | null;
  onSetError: (message: string) => void;
  onSetSubmitting: (value: boolean) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  tempTodo,
  isSubmitting,
  onDelete,
  isDeleting,
  isUpdating,
  onSetError,
  onSetSubmitting,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          onSetError={onSetError}
          onSetSubmitting={onSetSubmitting}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onToggle={() => {}}
          isSubmitting={isSubmitting}
          onDelete={onDelete}
          onSetError={onSetError}
          onSetSubmitting={onSetSubmitting}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};

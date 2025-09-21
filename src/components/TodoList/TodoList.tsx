import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  processingIds: number[];
  onToggleStatus: (todoId: number, completed: boolean) => Promise<void>;
  onTitleEdit: (
    todoId: number,
    completed: boolean,
    newTitle: string,
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
  onToggleStatus,
  onTitleEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          isProcessed={processingIds.includes(todo.id)}
          onToggleStatus={onToggleStatus}
          onTitleEdit={onTitleEdit}
        />
      ))}
    </section>
  );
};

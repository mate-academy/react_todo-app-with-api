import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todosFromServer: Todo[];
  onDelete: (v: number) => Promise<void>;
  tempTodo: Todo | null;
  loadingIds: number[];
  onUpdateStatus: (v: Todo) => void;
  onUpdateTitle: (v: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todosFromServer,
  onDelete,
  tempTodo,
  loadingIds,
  onUpdateStatus,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFromServer.map(todo => (
        <TodoItem
          key={todo.id}
          todoInfo={todo}
          deleteTodo={onDelete}
          loadingIds={loadingIds}
          onUpdateStatus={onUpdateStatus}
          onUpdateTitle={onUpdateTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todoInfo={tempTodo}
          deleteTodo={onDelete}
          loadingIds={[0]}
        />
      )}
    </section>
  );
};

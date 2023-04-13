import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingIds: number[];
  statusChange: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  statusChange,
}) => {
  return (
    <div>
      {todos.map(todo => {
        const isLoading = loadingIds.some(id => id === todo.id);

        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            onDelete={() => onDelete(todo.id)}
            isLoading={isLoading}
            statusChange={statusChange}
          />
        );
      })}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => onDelete(tempTodo.id)}
          isLoading
          statusChange={statusChange}
        />
      )}
    </div>
  );
};

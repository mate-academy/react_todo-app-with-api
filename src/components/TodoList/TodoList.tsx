import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { ErrorType } from '../../types/Error';

interface Props {
  preparedTodos: Todo[];
  tempTodo: Todo | null;
  processing: number[];
  error: ErrorType;
  onRemoveTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, dataToUpdate: Partial<Todo>) => void;
}

export const TodoList: FC<Props> = ({
  preparedTodos,
  tempTodo,
  processing,
  error,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          error={error}
          isLoading={processing.includes(todo.id)}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          error={error}
          isLoading={processing.includes(tempTodo.id)}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};

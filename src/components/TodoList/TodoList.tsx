import { FC } from 'react';
import { TodoTask } from '../TodoTask';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  processing: number[];
  error: ErrorType;
  removeTodo: (todoId: number) => void;
  changeTodo: (todoId: number, updatedData: Partial<Todo>) => void;

};

export const TodoList: FC<Props> = ({
  filteredTodos,
  tempTodo,
  processing,
  removeTodo,
  changeTodo,
  error,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoTask
          key={todo.id}
          todo={todo}
          error={error}
          isLoading={processing.includes(todo.id)}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />
      ))}

      {tempTodo && (
        <TodoTask
          todo={tempTodo}
          error={error}
          isLoading={processing.includes(tempTodo.id)}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />
      )}
    </section>
  );
};

import { FC } from 'react';
import { TodoTask } from '../TodoTask';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  processingTodoIds: number[];
  error: ErrorType;
  removeTodo: (todoId: number) => void;
  updateTodo: (todoId: number, updatedData: Partial<Todo>) => void;

};

export const TodoList: FC<Props> = ({
  filteredTodos,
  tempTodo,
  processingTodoIds,
  removeTodo,
  updateTodo,
  error,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoTask
          key={todo.id}
          todo={todo}
          error={error}
          isLoading={processingTodoIds.includes(todo.id)}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoTask
          todo={tempTodo}
          error={error}
          isLoading={processingTodoIds.includes(tempTodo.id)}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};

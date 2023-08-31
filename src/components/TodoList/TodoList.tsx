import { FC } from 'react';
import { Todo } from '../../Types/Todos';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  loadingTodosIds: number[],
  onTodoDelete: (todoIds: number[]) => void;
  onTodoUpdate: (todoId: number, updatedTodo: Partial<Todo>) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  loadingTodosIds,
  onTodoDelete,
  onTodoUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          loadingTodosIds={loadingTodosIds}
          onDelete={onTodoDelete}
          onUpdate={onTodoUpdate}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodosIds={loadingTodosIds}
          onDelete={onTodoDelete}
          onUpdate={onTodoUpdate}
        />
      )}
    </section>
  );
};

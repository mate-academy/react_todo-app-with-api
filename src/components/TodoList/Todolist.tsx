import { FC } from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
  tempTodo: Todo | null;
  onUpdateTodo: (todoId: number, args: UpdateTodoArgs) => void;
  handleShowError: (error: string) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  onRemoveTodo,
  loadingTodo,
  tempTodo,
  onUpdateTodo,
  handleShowError,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          loadingTodo={loadingTodo}
          onUpdateTodo={onUpdateTodo}
          handleShowError={handleShowError}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodo={loadingTodo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          handleShowError={handleShowError}
        />
      )}
    </section>
  );
};

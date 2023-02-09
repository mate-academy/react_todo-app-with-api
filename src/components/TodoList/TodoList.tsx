import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
  updatingTodo: (todo: Todo) => void,
  todosToUpdate: number[],
  deletingTodosIds: number[],
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  isLoading,
  updatingTodo,
  todosToUpdate,
  deletingTodosIds,
  tempTodo,
}) => {
  const todosIdToUpdate = todosToUpdate;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isLoading={isLoading}
          isDeleting={deletingTodosIds.includes(todo.id)}
          updatingTodo={updatingTodo}
          isUpdating={todosIdToUpdate.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoading={isLoading}
          isDeleting={deletingTodosIds.includes(tempTodo.id)}
          removeTodo={removeTodo}
          updatingTodo={updatingTodo}
          isUpdating={false}
        />
      )}
    </section>
  );
});

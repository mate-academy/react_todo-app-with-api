import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void
  isLoading:boolean
  todosToUpdate: Todo[]
  onUpdateTodo: (todo: Todo) => void;
  deletingTodoId: number | null
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onDeleteTodo,
  isLoading,
  onUpdateTodo,
  todosToUpdate,
  deletingTodoId,
}) => {
  const idTodosToUpdate = todosToUpdate.map(todo => todo.id);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
          isUpdating={idTodosToUpdate.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          deletingTodoId={deletingTodoId}
        />
      ))}
    </section>
  );
});

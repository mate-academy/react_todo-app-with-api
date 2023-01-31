import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  deletingTodosIds: number[],
  updatingTodosIds: number[],
  temporaryTodo: Todo | null,
  handleDeleteTodo: (id: number) => void,
  updateTodo: (todoToChange: Todo) => void,
};

export const Todolist: React.FC<Props> = memo(({
  todos,
  deletingTodosIds,
  updatingTodosIds,
  temporaryTodo,
  handleDeleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          deletingTodosIds={deletingTodosIds}
          updatingTodosIds={updatingTodosIds}
          handleDeleteTodo={handleDeleteTodo}
          updateTodo={updateTodo}
        />
      ))}

      {temporaryTodo && (
        <TodoInfo
          todo={temporaryTodo}
          deletingTodosIds={deletingTodosIds}
          updatingTodosIds={updatingTodosIds}
          handleDeleteTodo={handleDeleteTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});

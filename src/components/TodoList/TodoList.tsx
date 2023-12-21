import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (id: number) => Promise<void>,
  tempTodo: Todo | null,
  isLoading: boolean,
  updateTodo: (todo: Todo) => Promise<void>,
  titleRef: React.RefObject<HTMLInputElement>,
};

export const TodoList: FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
  isLoading,
  updateTodo,
  titleRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          key={todo.id}
          updateTodo={updateTodo}
          titleRef={titleRef}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isLoading={isLoading}
          updateTodo={updateTodo}
          titleRef={titleRef}
        />
      )}
    </section>
  );
});

import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void
  isLoading:boolean
  onUpdateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onDeleteTodo,
  isLoading,
  onUpdateTodo,

}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </section>
  );
});

import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  loadingTodosId: Set<number>,
  onUpdate: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    onDelete,
    loadingTodosId,
    onUpdate,
  } = props;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loadingTodosId={loadingTodosId}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={onDelete}
          loadingTodosId={loadingTodosId}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};

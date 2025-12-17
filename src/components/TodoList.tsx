import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, completed: boolean) => Promise<void>;
};

export const TodoList = ({
  todos,
  loadingTodoIds,
  onChange,
  onRemove,
  onUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoIds={loadingTodoIds}
          onChange={onChange}
          onRemove={onRemove}
          inputValue={''}
          onUpdate={(id, title) => onUpdate(id, title, todo.completed)}
        />
      ))}
    </section>
  );
};

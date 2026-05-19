import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingIds: number[];
  onChecked: (obj: Todo) => void;
  onChange: (obj: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingIds,
  onChecked,
  onChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteItem={onDelete}
          isLoading={loadingIds.includes(todo.id)}
          isComplete={onChecked}
          isChange={onChange}
        />
      ))}
    </section>
  );
};

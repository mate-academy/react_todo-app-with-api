import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    processingIds,
    onDelete,
    onUpdate,
  },
) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            processingIds={processingIds}
          />
        ))
      }
    </section>
  );
};

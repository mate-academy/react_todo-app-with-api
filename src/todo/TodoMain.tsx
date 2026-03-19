import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  usingTodos: Todo[];
  processings: number[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoMain: React.FC<Props> = ({
  usingTodos,
  processings,
  onDelete,
  onUpdate,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {usingTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processings.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onUpdate={data => onUpdate(todo.id, data)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessed={true}
          onDelete={() => {}}
          onUpdate={async () => {}}
          dataCy="Todo"
        />
      )}
    </section>
  );
};

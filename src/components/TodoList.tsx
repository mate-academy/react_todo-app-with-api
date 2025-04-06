import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, onUpdate }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};

import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

type Props = {
  filteredTodos: Todo[];
  onRemoveTodo: (id: number) => void;
  onUpdateTodo: (todo: Todo) => Promise<Todo>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {filteredTodos.map(todo => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            onRemoveTodo={onRemoveTodo}
            isLoading={todo.id === 0 || todo.isLoaded}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </div>
    </section>
  );
};

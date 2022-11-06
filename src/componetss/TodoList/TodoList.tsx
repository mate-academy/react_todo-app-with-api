import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  isAdding: boolean;
  toggleLoader: boolean;
  selectedId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  handleUpdateTodo,
  isAdding,
  toggleLoader,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          handleUpdateTodo={handleUpdateTodo}
          isAdding={isAdding}
          toggleLoader={toggleLoader}
          selectedId={selectedId}
        />
      ))}
    </section>
  );
};

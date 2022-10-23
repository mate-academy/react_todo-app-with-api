import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  isAdding: boolean;
  toggleLoader: boolean;
  selectedId: number;
  title: string;
  handleUpdateTodo: (todoId: number, data: Partial<Todo>) => void;
  completedIds: number[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  isAdding,
  toggleLoader,
  selectedId,
  handleUpdateTodo,
  completedIds,
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
          completedIds={completedIds}
        />
      ))}
    </section>
  );
};

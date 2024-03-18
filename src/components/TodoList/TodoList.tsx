import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  onTodoFocus: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  filteredTodos,
  loadingTodoIds,
  setLoadingTodoIds,
  setError,
  onTodoFocus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          setError={setError}
          onTodoFocus={onTodoFocus}
          key={todo.id}
        />
      ))}
    </section>
  );
};

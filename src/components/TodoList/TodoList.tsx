import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  isLoaded: boolean,
  removeTodo: (param: number) => void,
  handleChange: (todoId: number, data: Partial<Todo>) => void
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos, isLoaded, removeTodo, handleChange,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoaded={isLoaded}
          removeTodo={removeTodo}
          handleChange={handleChange}
        />
      ))}
    </section>
  );
};

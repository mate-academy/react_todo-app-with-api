import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  handleDelete: (todoId: number) => void;
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  handleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoItem
            handleDelete={handleDelete}
            handleChange={handleChange}
            todo={todo}
          />
        );
      })}
    </section>
  );
};

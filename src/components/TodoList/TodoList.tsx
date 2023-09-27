import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement/TodoElement';

interface Props {
  todos: Todo[],
}

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoElement todo={todo} key={todo.id} />
      ))}
    </section>
  );
};

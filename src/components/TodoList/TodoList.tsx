import { useAppContext } from '../../AppContext';
import { Todo as TodoType } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoType[]
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <TodoItem key={tempTodo?.id} todo={tempTodo} />
      )}
    </section>
  );
};

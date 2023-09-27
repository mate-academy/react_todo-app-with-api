import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onTodosChange: React.Dispatch<React.SetStateAction<Todo[]>>,
  onErrorMesssageChange: (val: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodosChange,
  onErrorMesssageChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodosChange={onTodosChange}
          onErrorMesssageChange={onErrorMesssageChange}
        />
      ))}

      {tempTodo && (
        <TempTodo tempTodo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};

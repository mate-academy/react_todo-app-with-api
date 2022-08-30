import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (v: number) => void;
  setTodos: (v: Todo[]) => void;
  changeStatusTodo: (v: number, v2: boolean) => void;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    removeTodo,
    setTodos,
    changeStatusTodo,
  } = props;

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          setTodos={setTodos}
          changeStatusTodo={changeStatusTodo}
        />
      ))}
    </>
  );
};

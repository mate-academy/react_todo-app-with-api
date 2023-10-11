import { Todo } from '../types/Types';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[]
  tempTodo:null | Todo;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loader: number[],
  setLoader: React.Dispatch<React.SetStateAction<number[]>>
}

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  setError,
  setTodos,
  loader,
  setLoader,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          setError={setError}
          setTodos={setTodos}
          loader={loader}
          setLoader={setLoader}
          todo={todo}
        />

      ))}

      {tempTodo && (
        <TodoInfo
          setError={setError}
          setTodos={setTodos}
          loader={loader}
          setLoader={setLoader}
          todo={tempTodo}
        />
      )}
    </section>
  );
};

import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (value: ErrorType) => void;
  updatingTodos: number[];
  tempTodo : Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  updatingTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          isUpdating={updatingTodos.includes(todo.id)}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};

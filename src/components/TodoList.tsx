import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../enums/error';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosId: number[] | [];
  handleDeletedTodo: (id: number) => void;
  handleUpdatedTodo: (id: number) => void;
  setDeletedTodosId: React.Dispatch<React.SetStateAction<number[] | []>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletedTodosId,
  handleDeletedTodo,
  handleUpdatedTodo,
  setDeletedTodosId,
  setTodos,
  setError,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoInfo
          todo={todo}
          deletedTodosId={deletedTodosId}
          handleDeletedTodo={handleDeletedTodo}
          handleUpdatedTodo={handleUpdatedTodo}
          setDeletedTodosId={setDeletedTodosId}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
        />
      </li>
    ))}

    {!!tempTodo && (
      <TodoInfo
        todo={tempTodo}
        deletedTodosId={deletedTodosId}
        handleDeletedTodo={handleDeletedTodo}
        handleUpdatedTodo={handleUpdatedTodo}
        setDeletedTodosId={setDeletedTodosId}
        todos={todos}
        setTodos={setTodos}
        setError={setError}
      />
    )}
  </ul>
);

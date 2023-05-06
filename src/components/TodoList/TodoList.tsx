import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  actionsTodosId: number[] | [];
  handleDeleteTodo: (id: number) => void;
  handleToggleTodo: (id: number) => void;
  setActionsTodosId: (value: number[] | []) => void;
  setTodos: (value: Todo[]) => void;
  setError: (value: Error) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  actionsTodosId,
  handleDeleteTodo,
  handleToggleTodo,
  setActionsTodosId,
  setTodos,
  setError,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoItem
          todo={todo}
          actionsTodosId={actionsTodosId}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodo={handleToggleTodo}
          setActionsTodosId={setActionsTodosId}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
        />
      </li>
    ))}

    {!!tempTodo && (
      <TodoItem
        todo={tempTodo}
        actionsTodosId={actionsTodosId}
        handleDeleteTodo={handleDeleteTodo}
        handleToggleTodo={handleToggleTodo}
        setActionsTodosId={setActionsTodosId}
        todos={todos}
        setTodos={setTodos}
        setError={setError}
      />
    )}
  </ul>
);

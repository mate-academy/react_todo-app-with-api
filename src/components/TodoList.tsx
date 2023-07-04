import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosId: number[] | [];
  handleDeletedTodo: (id: number) => void;
  handleUpdatedTodo: (ids: number[], value: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletedTodosId,
  handleDeletedTodo,
  handleUpdatedTodo,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoInfo
          todo={todo}
          deletedTodosId={deletedTodosId}
          handleDeletedTodo={handleDeletedTodo}
          handleUpdatedTodo={handleUpdatedTodo}
        />
      </li>
    ))}

    {!!tempTodo && (
      <TodoInfo
        todo={tempTodo}
        deletedTodosId={deletedTodosId}
        handleDeletedTodo={handleDeletedTodo}
        handleUpdatedTodo={handleUpdatedTodo}
      />
    )}
  </ul>
);

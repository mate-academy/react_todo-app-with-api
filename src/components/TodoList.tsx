import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | string>>;
  toggleTodo: (todoToUpdate: Todo) => void;
  renameTodo: (editedTitle: string, todoToRename: Todo) => void;
  loadingId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  allTodos: Todo[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  setErrorMessage,
  toggleTodo,
  renameTodo,
  loadingId,
  setTodos,
  allTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setErrorMessage={setErrorMessage}
          toggleTodo={toggleTodo}
          renameTodo={renameTodo}
          loadingId={loadingId}
          setTodos={setTodos}
          todos={allTodos}
        />
      ))}
    </section>
  );
};

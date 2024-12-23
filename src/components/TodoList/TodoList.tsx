import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  isLoading: boolean;
  setErrorMessage: (errorText: string) => void;
  handleDeleteTodo: (id: number) => void;
  setloadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  loadingIds: number[];
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  isLoading,
  tempTodo,
  handleDeleteTodo,
  setErrorMessage,
  setloadingIds,
  loadingIds,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          setloadingIds={setloadingIds}
          setTodos={setTodos}
          loadingIds={loadingIds}
          setErrorMessage={setErrorMessage}
          handleUpdateTodo={handleUpdateTodo}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

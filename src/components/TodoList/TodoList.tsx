import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setErrorMessage: (message: string) => void;
  removeDeletedTodo: (id: number) => void;
  refreshTodo: (newTodo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setErrorMessage,
  removeDeletedTodo,
  refreshTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            setErrorMessage={setErrorMessage}
            removeDeletedTodo={removeDeletedTodo}
            refreshTodo={refreshTodo}
            key={todo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isActive={true}
          setErrorMessage={setErrorMessage}
          removeDeletedTodo={removeDeletedTodo}
          refreshTodo={refreshTodo}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};

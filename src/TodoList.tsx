import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  deletingTodoId,
  todos,
  updateTodos,
  setTodos,
  setError,
  updateStatus,
  handleDelete,
  handleStatus,
  updatingStatusIds,
  clearingCompletedIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          isDeleting={deletingTodoId === todo.id}
          todo={todo}
          todos={todos}
          updateTodos={updateTodos}
          setTodos={setTodos}
          setError={setError}
          key={todo.id}
          updateStatus={updateStatus}
          handleDelete={handleDelete}
          handleStatus={handleStatus}
          updatingStatusIds={updatingStatusIds}
          clearingCompletedIds={clearingCompletedIds}
        />
      ))}
    </section>
  );
};

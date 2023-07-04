import { Todo, UpdatedTodo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  deletedTodoId: number[],
  handleUpdateTodo: (todoId: number,
    args: UpdatedTodo) => void,
  updatingTodoIds: number[],
};

export const Todolist: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  deletedTodoId,
  handleUpdateTodo,
  updatingTodoIds,
}) => (
  <section className="todoapp__main">
    {filteredTodos?.map(todo => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        removeTodo={removeTodo}
        deletedTodoId={deletedTodoId}
        handleUpdateTodo={handleUpdateTodo}
        updatingTodoIds={updatingTodoIds}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        removeTodo={removeTodo}
        deletedTodoId={deletedTodoId}
        handleUpdateTodo={handleUpdateTodo}
        updatingTodoIds={updatingTodoIds}
      />
    )}
  </section>
);

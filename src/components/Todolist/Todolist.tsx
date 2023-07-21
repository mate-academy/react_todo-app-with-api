import { Todo, UpdatedTodo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  handleUpdateTodo: (todoId: number,
    args: UpdatedTodo) => void,
  delUpdTodoIds: number[],
};

export const Todolist: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  handleUpdateTodo,
  delUpdTodoIds,
}) => (
  <section className="todoapp__main">
    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        removeTodo={removeTodo}
        delUpdTodoIds={delUpdTodoIds}
        handleUpdateTodo={handleUpdateTodo}
      />
    )}

    {filteredTodos?.map(todo => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        removeTodo={removeTodo}
        delUpdTodoIds={delUpdTodoIds}
        handleUpdateTodo={handleUpdateTodo}
      />
    ))}

  </section>
);

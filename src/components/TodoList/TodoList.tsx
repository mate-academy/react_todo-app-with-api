import { useTodosContext } from '../../hook/useTodosContext';
import { TodoItem } from '../TodoItems';

export const TodoList = () => {
  const { todos, filteredTodos, tempTodo } = useTodosContext();

  return (
    todos?.length > 0 && (
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {tempTodo && <TodoItem todo={tempTodo} />}
      </section>
    )
  );
};

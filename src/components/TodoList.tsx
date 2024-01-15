import { useTodo } from '../providers/TodoProvider';
import { TodoInfo } from './TodoInfo';

export const TodoList = () => {
  const {
    visibleTodos,
    tempTodo,
  } = useTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => <TodoInfo todo={todo} />)}

      {tempTodo && <TodoInfo todo={tempTodo} />}
    </section>
  );
};

import { TodoInfo } from '../TodoInfo/TodoInfo';
import { useTodos } from '../context/TodosContext';
import { getPreparedTodos } from '../../utils/todos';

export const TodoList: React.FC = () => {
  const { todos, statusTodo, tempTodo } = useTodos();
  const todosToDisplay = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = getPreparedTodos(todosToDisplay, { statusTodo });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}
    </section>
  );
};

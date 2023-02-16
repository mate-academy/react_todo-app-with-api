import { Todo } from '../../types/Todo';
import { TodoContent } from '../TodoContent/TodoContent';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  updatingTodos: number[];
  updateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodo,
  updatingTodos,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoContent
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          updatingTodos={updatingTodos}
          updateTodo={updateTodo}
        />
      ))}
    </section>
  );
};

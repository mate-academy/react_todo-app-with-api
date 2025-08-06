import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todoList: Todo[];
  todoTemp: Todo | null;
  deleteTodo: (postId: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  todoTemp,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          deleteTodo={deleteTodo}
          tempLoader={true}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};

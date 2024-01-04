import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  handlDdeleteTodo: (value: number) => void,
  arryLoader: number[] | null,
  handlUpdateTodo: (value: Todo) => void,
  quryInput: string,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  handlDdeleteTodo,
  arryLoader,
  handlUpdateTodo,
  quryInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handlDdeleteTodo={handlDdeleteTodo}
          arryLoader={arryLoader}
          handlUpdateTodo={handlUpdateTodo}
          quryInput={quryInput}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handlDdeleteTodo={handlDdeleteTodo}
          arryLoader={arryLoader}
          handlUpdateTodo={handlUpdateTodo}
          quryInput={quryInput}
        />
      )}
    </section>
  );
};

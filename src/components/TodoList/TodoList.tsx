import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  handleDeleteTodo: (value: number) => void,
  arrayLoader: number[] | null,
  handleUpdateTodo: (value: Todo) => void,
  quryInput: string,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  arrayLoader,
  handleUpdateTodo,
  quryInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          arrayLoader={arrayLoader}
          handleUpdateTodo={handleUpdateTodo}
          quryInput={quryInput}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          arrayLoader={arrayLoader}
          handleUpdateTodo={handleUpdateTodo}
          quryInput={quryInput}
        />
      )}
    </section>
  );
};

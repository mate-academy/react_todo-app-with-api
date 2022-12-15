import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  loader: boolean;
  focusedTodoId: number;
  togglerLoader: boolean;
  onDeleteTodo: (value: number) => void;
  onUpdateTodo: (todoId: number, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onUpdateTodo,
  loader,
  focusedTodoId,
  togglerLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          focusedTodoId={focusedTodoId}
          loader={loader}
          togglerLoader={togglerLoader}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </section>
  );
};

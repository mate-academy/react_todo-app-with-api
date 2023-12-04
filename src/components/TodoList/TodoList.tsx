import { ErrorNotification } from '../../types/ErrorNotification';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  removeTodo: (todo: Todo) => void;
  filteredTodos: Todo[];
  setErrorMessage: (q: ErrorNotification) => void;
}

export const TodoList: React.FC<Props> = ({
  removeTodo,
  filteredTodos,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          isTempTodo={false}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};

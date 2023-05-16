import { FC, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask';
import { TodoContext } from '../TodoProvider';

interface Props {
  preparedTodos: Todo[];
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = ({
  preparedTodos,
  tempTodo,
}) => {
  const { processing } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
        <TodoTask
          key={todo.id}
          todo={todo}
          isLoading={processing.includes(todo.id)}

        />
      ))}

      {tempTodo && (
        <TodoTask
          todo={tempTodo}
          isLoading={processing.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};

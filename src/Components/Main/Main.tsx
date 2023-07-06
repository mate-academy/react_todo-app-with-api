import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodos: number[];
  updateTodoInfo: (
    todoId: number,
    newTodoData: Partial <Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>;
};

export const Main: FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  loadingTodos,
  updateTodoInfo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
          updateTodoInfo={updateTodoInfo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
          updateTodoInfo={updateTodoInfo}
        />
      )}
    </section>
  );
};

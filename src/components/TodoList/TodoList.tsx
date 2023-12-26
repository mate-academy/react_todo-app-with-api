import { FC } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  deleteTodo: (id: number) => void,
  tempTodo: TodoType | null,
  loadingTodosIds: number[];
  updateTodo : (id: number, newData: Partial<TodoType>) => Promise<void>;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loadingTodosIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <Todo
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            Loader={loadingTodosIds.includes(todo.id)}
            updateTodo={updateTodo}
          />
        );
      })}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          deleteTodo={deleteTodo}
          Loader
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};

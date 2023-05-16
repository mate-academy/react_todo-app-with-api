import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { LoadingTodo } from '../LoadingTodo';
import { TodoComponent } from '../TodoComponent/TodoComponent';

interface Props {
  todos: Todo[];
  removeTodo: (todoData: Todo) => void;
  tempTodo: Todo | null;
  onChangeTodo: (todo: Todo, value: boolean | string) => void;
}

export const MainTodoApp: FC<Props> = React.memo(({
  todos,
  removeTodo,
  tempTodo,
  onChangeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const { id } = todo;

        return tempTodo?.id !== id
          ? (
            <TodoComponent
              key={id}
              todo={todo}
              removeTodo={removeTodo}
              onChangeTodo={onChangeTodo}
            />
          )
          : <LoadingTodo key={id} todo={tempTodo} />;
      })}

      {todos.every(({ id }) => id !== tempTodo?.id) && tempTodo && (
        <LoadingTodo todo={tempTodo} />
      )}
    </section>
  );
});

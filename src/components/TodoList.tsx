import { FC, memo } from 'react';
import { TodoUpdate, Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  removeTodo: (id: number) => void;
  tempTodo: TodoType | null;
  updateTodo: (id: number, newValues: TodoUpdate) => void;
};

export const TodoList: FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
  updateTodo,
}) => {
  return (
    <ul className="todoapp__main">
      {todos?.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      )}
    </ul>
  );
});

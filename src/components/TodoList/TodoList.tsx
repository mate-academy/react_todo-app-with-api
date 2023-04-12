import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (id: number) => void,
  changeStatus: (id: number, property: Partial<Todo>) => void,
}
export const TodoList: FC<Props> = ({ todos, removeTodo, changeStatus }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={removeTodo}
          changeStatus={changeStatus}
        />
      ))}
    </section>
  );
};

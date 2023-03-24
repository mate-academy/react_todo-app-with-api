import { FC } from 'react';
import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  onDelete: (id: number) => void;
  todos: Todo[];
};

export const TodoList: FC<Props> = ({ onDelete, todos }) => {
  return (
    <section className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} onDelete={onDelete} />
      ))}
    </section>
  );
};

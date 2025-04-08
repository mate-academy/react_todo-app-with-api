/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  removeTodo: (todoId: number) => void;
  todoOnLoading: number[] | null;
  handleToggle: (id: number) => void;
  handleEditTodo: (id: number, title: string) => Promise<boolean>;
};

export const TodoList: FC<Props> = ({
  filteredTodos,
  removeTodo,
  todoOnLoading,
  handleToggle,
  handleEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          todoOnLoading={todoOnLoading}
          handleToggle={handleToggle}
          handleEditTodo={handleEditTodo}
        />
      ))}
    </section>
  );
};

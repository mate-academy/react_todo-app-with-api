import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  checkboxTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  update: number[];
  updateTodo: (todo: Todo) => Promise<void | Todo>;
  mesage: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  checkboxTodo,
  deleteTodo,
  update,
  updateTodo,
  mesage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          checkboxTodo={checkboxTodo}
          deleteTodo={deleteTodo}
          update={update}
          updateTodo={updateTodo}
          mesage={mesage}
        />
      ))}
    </section>
  );
};

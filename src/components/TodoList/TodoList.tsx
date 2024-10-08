/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  deleteTodo: (todoId: number) => void;
  setErrorMessage: (errorMessage: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  deleteTodo,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setTodos={setTodos}
          onDelete={deleteTodo}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};

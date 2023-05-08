import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <div>
      {todos.map((todo: Todo) => (<TodoItem todo={todo} key={todo.id} />))}
    </div>
  );
};

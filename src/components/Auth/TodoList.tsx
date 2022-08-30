import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
}

export const TodoList: React.FC<Props> = (props) => {
  const { todos } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => <TodoItem todo={todo} />)}
    </section>
  );
};

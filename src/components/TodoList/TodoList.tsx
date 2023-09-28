import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};

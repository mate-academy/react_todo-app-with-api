import React from 'react';
import { Todo } from '../../types/Todo';
import { SingleTodo } from '../SingleTodo';

type Props = {
  todos: Todo[];
  activeTodoId: number[];
  remove: (id: number[]) => void;
  toggle: (todo: Todo[]) => void;
  update: (todo: Todo) => void;
};

export const Todos = React.memo<Props>(({
  todos,
  activeTodoId,
  remove,
  toggle,
  update,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <SingleTodo
          todo={todo}
          key={todo.id}
          activeTodoId={activeTodoId}
          remove={remove}
          toggle={toggle}
          update={update}
        />
      ))}
    </section>
  );
});

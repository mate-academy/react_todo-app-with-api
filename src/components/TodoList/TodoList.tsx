import React from 'react';
import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';
import { useTodoContext } from '../../TodoContext';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
}) => {
  const {
    tempTodo,
  } = useTodoContext();

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
});

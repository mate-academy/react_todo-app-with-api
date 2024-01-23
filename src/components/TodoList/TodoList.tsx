import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  updateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  onDelete,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
});

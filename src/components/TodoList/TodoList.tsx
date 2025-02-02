import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleUpdateTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          loadingTodoId={loadingTodoId}
        />
      ))}
    </section>
  );
};

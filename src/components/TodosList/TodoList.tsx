import React from 'react';
import { TodoListItem } from '../TodoListItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => void,
  loadingTodosIds: number[];
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onTodoDelete,
  loadingTodosIds,
  onUpdateTodo,
}) => (
  <section className="todoapp__main">
    {todos?.map(todo => (
      <TodoListItem
        key={todo.id}
        todo={todo}
        onTodoDelete={onTodoDelete}
        loadingTodosIds={loadingTodosIds}
        onUpdateTodo={onUpdateTodo}
      />
    ))}
  </section>
));

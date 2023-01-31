import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  selectedTodosIds: number[];
  onEditTodo: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onTodoDelete,
  selectedTodosIds,
  onEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodoDelete={onTodoDelete}
          isDeleting={selectedTodosIds.includes(todo.id)}
          onEditTodo={onEditTodo}
        />
      ))}
    </section>
  );
});

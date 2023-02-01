import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onTodoDelete: (selectedTodoId: number) => void,
  tempTodo: Todo | null,
  loadingTodosIds: number[],
  updateTodo: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>,
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onTodoDelete,
  tempTodo,
  loadingTodosIds,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          loadingTodosIds={loadingTodosIds}
          onUpdateTodo={updateTodo}
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

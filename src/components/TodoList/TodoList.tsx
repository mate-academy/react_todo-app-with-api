import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onUpdate: (id: number, todoData: Partial<Todo>) => void;
  onDelete: (todoId: number) => void;
  processedTodosIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos: todos,
  tempTodo,
  onUpdate,
  onDelete,
  processedTodosIds,
}) => {
  const todoBaseItem = (todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onUpdate={onUpdate}
      onDelete={onDelete}
      processedTodosIds={processedTodosIds}
    />
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todoBaseItem)}
      {tempTodo && todoBaseItem(tempTodo)}
    </section>
  );
};

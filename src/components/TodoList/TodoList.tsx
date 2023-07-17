import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  tempTodo: Todo | null;
  todos: Todo[];
  onRemoveTodo: (id: number) => void;
  onUpdateTodo: (todoId: number, updatedValue: string | boolean) => void;
  loadingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = memo(({
  tempTodo,
  todos,
  onRemoveTodo,
  onUpdateTodo,
  loadingTodoIds,
}) => {
  const loadedTodos = tempTodo
    ? [...todos, tempTodo]
    : todos;

  return (
    <section className="todoapp__main">
      {loadedTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          loadingTodoIds={loadingTodoIds}
        />
      ))}
    </section>
  );
});

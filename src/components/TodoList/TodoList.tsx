import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isLoadingTodo: number[],
  onRemoveTodo: (todoId: number) => void,
  onEditTodo: (todoId: number, properties: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  isLoadingTodo,
  onRemoveTodo,
  onEditTodo,
}) => {
  return (
    <section className="todoapp__main">
      { todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          isLoadingTodo={isLoadingTodo}
          onRemoveTodo={onRemoveTodo}
          onEditTodo={onEditTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoadingTodo={isLoadingTodo}
          onRemoveTodo={onRemoveTodo}
          onEditTodo={onEditTodo}
        />
      )}
    </section>
  );
});

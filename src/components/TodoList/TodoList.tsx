import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[],
  removeTodo: (todoId: number) => Promise<void>,
  tempTodo: Todo | null,
  isAddingTodo: boolean,
  isUpdating: boolean,
  onUpdateTodo: (todoId: number, updateData: Partial<Todo>) => Promise<void>
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
  isAddingTodo,
  isUpdating,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          isAddingTodo={false}
          onUpdateTodo={onUpdateTodo}
          isUpdating={false}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          isAddingTodo={isAddingTodo}
          todo={tempTodo}
          removeTodo={removeTodo}
          onUpdateTodo={onUpdateTodo}
          isUpdating={isUpdating}
        />
      )}
    </section>
  );
});

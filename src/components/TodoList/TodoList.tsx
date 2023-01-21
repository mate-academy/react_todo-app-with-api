import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export type Props = {
  todos: Todo[],
  onDeleteTodo(id: number): void,
  tempTodo: Todo | null,
  loadingTodoIds: number[],
  onChangeStatus(id: number, status: boolean): void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingTodoIds,
  tempTodo,
  onChangeStatus,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onChangeStatus={onChangeStatus}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onChangeStatus={onChangeStatus}
          isLoading
        />
      )}
    </ul>
  );
};

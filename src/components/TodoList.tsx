import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  temporaryTodo: Todo | null,
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
  loadingTodoIds: number[],
  onUpdate: (id: number, data: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, temporaryTodo, onDelete, onToggle, loadingTodoIds, onUpdate,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingTodoIds.includes(todo.id)}
          onUpdate={onUpdate}
        />
      ))}

      {temporaryTodo && (
        <TodoInfo
          todo={temporaryTodo}
          key={temporaryTodo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingTodoIds.includes(temporaryTodo.id)}
          onUpdate={onUpdate}
        />
      )}
    </ul>
  );
};

import React from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../Item/Item';
import {
  TodoRemoveHandler,
  TodoRename,
  TodoUpdate,
} from '../../../types/TodoMethods';

type Props = {
  todos: Todo[];
  todoIdsInProcess: Todo['id'][];
  temporaryTodo: Todo | null;
  onTodoRemove: TodoRemoveHandler;
  onTodoUpdate: TodoUpdate;
  onTodoRename: TodoRename;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoIdsInProcess,
  temporaryTodo,
  onTodoRemove,
  onTodoUpdate,
  onTodoRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemove={onTodoRemove}
          isLoading={todoIdsInProcess.includes(todo.id)}
          onToggle={onTodoUpdate}
          onRename={onTodoRename}
        />
      ))}
      {temporaryTodo && (
        <TodoItem key={-1} todo={temporaryTodo} isLoading={true} />
      )}
    </section>
  );
};

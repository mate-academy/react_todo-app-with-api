import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodoHandler: (id: number) => Promise<void>;
  modifyingTodoIds: number[];
  tempTodo: Todo | null;
  onTodoUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  modifyingTodoIds,
  deleteTodoHandler,
  tempTodo,
  onTodoUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isLoading={modifyingTodoIds.includes(todo.id)}
        onTodoDelete={() => deleteTodoHandler(todo.id)}
        onTodoUpdate={onTodoUpdate}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        isLoading
      />
    )}
  </section>
);

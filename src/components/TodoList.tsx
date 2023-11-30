import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onDeleteTodo?: (todoId: Todo['id']) => Promise<void>;
  onUpdateTodo?: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  onDeleteTodo,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        onUpdateTodo={onUpdateTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        isProcessed
      />
    )}
  </section>
);

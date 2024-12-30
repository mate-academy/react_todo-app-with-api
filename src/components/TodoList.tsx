import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onRemoveTodo: (id: number) => Promise<void>;
  loadingTodoIds: number[];
  updatedTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  loadingTodoIds,
  updatedTodo,
  tempTodo,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          updatedTodo={updatedTodo}
          isInEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          updatedTodo={updatedTodo}
          setEditedTodoId={setEditedTodoId}
          isLoading
        />
      )}
    </section>
  );
};

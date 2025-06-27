import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  loadingIds: number[];
  onChecked: (todoId: number) => void;
  onDeleted: (todoId: number) => void;
  onUpdated: (todoId: number, newTitle: string) => void;
  isLoading: boolean;
};

export const TodoList = ({
  todos /*, onChecked*/,
  tempTodo,
  loadingIds,
  onDeleted,
  isLoading,
  onChecked,
  onUpdated,
}: Props) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  if (!todos) {
    return null;
  }

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingIds.includes(todo.id)}
          onDeleted={onDeleted}
          onChecked={onChecked}
          onUpdated={onUpdated}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />
      ))}
      {isLoading && (
        <TodoItem
          key={'temp'}
          todo={tempTodo}
          loading={true}
          onDeleted={onDeleted}
          onChecked={onChecked}
          onUpdated={onUpdated}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />
      )}
    </>
  );
};

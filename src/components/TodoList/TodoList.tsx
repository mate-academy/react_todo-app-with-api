import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoPatch } from '../../types/TodoPatch';

type Props = {
  todos: Todo[],
  tempTodo: null | Todo,
  onDelete: (todoId: number) => void,
  onUpdateTodo: (todoId: number, data: TodoPatch) => void,
  loadingTodoIds: number[],
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos,
    tempTodo,
    onDelete,
    onUpdateTodo,
    loadingTodoIds,
  }) => (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          onUpdateTodo={onUpdateTodo}
          key={todo.id}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          isLoading
        />
      )}
    </section>

  ),
);

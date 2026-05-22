import React from 'react';
import { Todo, TodoUpdate } from '../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todoList: Todo[];
  loadingIds: Todo['id'][];
  onDeleteTodo: (id: Todo['id']) => void;
  onChangeTodo: (id: Todo['id'], values: TodoUpdate) => Promise<void>;
  tempTodo?: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todoList = [],
  loadingIds = [],
  onDeleteTodo,
  onChangeTodo,
  tempTodo = null,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onChange={onChangeTodo}
          loading={loadingIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading
          onChange={onChangeTodo}
          onDelete={onDeleteTodo}
        />
      )}
    </section>
  );
};

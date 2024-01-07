import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void
  updateTitle: (id: number, title: string) => void,
  updateStatus: (id: number, status: boolean) => void,
}

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDelete, updateTitle, updateStatus,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          updateTitle={updateTitle}
          updateStatus={updateStatus}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          updateTitle={updateTitle}
          updateStatus={updateStatus}
        />
      )}
    </section>
  );
};

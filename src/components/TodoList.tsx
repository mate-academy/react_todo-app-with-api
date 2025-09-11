import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle?: (id: number, status: boolean) => void;
  onDoubleClick: (todo: Todo | null) => void;

  selectedTodo: Todo | null;
  onUpdate: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle = () => {},
  onDoubleClick = () => {},
  selectedTodo = null,
  onUpdate = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onDoubleClick={onDoubleClick}
          selectedTodo={selectedTodo}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};

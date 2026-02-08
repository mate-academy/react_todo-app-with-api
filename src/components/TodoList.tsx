import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  editingTodoIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  editingTodoIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={editingTodoIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => onToggle(todo)}
          onRename={title => onRename(todo, title)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};

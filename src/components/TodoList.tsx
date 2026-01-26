import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  processingIds: number[];
  onUpdate: (todo: Todo) => Promise<void>;
  onToggle: (id: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, tempTodo, onDelete, processingIds, onUpdate, onToggle }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDelete}
            loading={processingIds.includes(todo.id)}
            onUpdateTodo={onUpdate}
            onToggleTodo={onToggle}
          />
        ))}

        {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';

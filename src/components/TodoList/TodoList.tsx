import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  tasks: Todo[] | null;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate?: (id: number, title: string) => Promise<void>;
  updatingTodos: Set<number>;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onDelete,
  onToggle,
  onUpdate,
  updatingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tasks &&
        tasks.map(task => (
          <TodoItem
            key={task.id}
            todo={task}
            onDelete={onDelete}
            onToggle={onToggle}
            onUpdate={onUpdate}
            isUpdating={updatingTodos.has(task.id)}
          />
        ))}
    </section>
  );
};

export default React.memo(TodoList);

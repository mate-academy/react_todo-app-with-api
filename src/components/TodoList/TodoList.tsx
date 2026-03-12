import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  filter: Filter;
  processingIds: number[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onRename: (id: number, newTitle: string, onSuccess: () => void) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  processingIds,
  tempTodo,
  onDelete,
  onToggle,
  onRename,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && <TodoInfo key={0} todo={tempTodo} isProcessing />}
    </section>
  );
};

import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import { FilteredTodos } from '../../utils/FilteredTodos';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  status: TodoStatus;
  loadingTodos: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  status,
  loadingTodos,
  onDelete,
  onUpdate,
}) => {
  const filteredTodos = FilteredTodos(visibleTodos, status);

  const handleToggle = (todo: Todo) => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleUpdate = (todo: Todo, newTitle: string) => {
    onUpdate({ ...todo, title: newTitle });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => handleToggle(todo)}
          onUpdate={newTitle => handleUpdate(todo, newTitle)}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          onDelete={() => {}}
          onToggle={() => {}}
          onUpdate={() => {}}
        />
      )}
    </section>
  );
};

import { FC } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { FilterType } from '../../enums/FilterType';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import type { Todo } from '../../types/Todo';

type Props = {
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  todos: Todo[];
  filterType: FilterType;
};

export const TodoList: FC<Props> = ({
  todos,
  filterType,
  onDelete,
  onUpdate,
}) => {
  const visibleTodos = getFilteredTodos(todos, filterType);

  return (
    <section className="flex flex-col gap-2">
      {visibleTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};

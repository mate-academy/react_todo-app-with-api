import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { useState } from 'react';
type Props = {
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  loading: boolean;
  filtered: Todo[];
  tempTodo: Todo | null;
  onEditTodo: (id: number, title: string) => void;
  onLoading: (is: boolean) => void;
  onError: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  onToggle,
  onDeleteTodo,
  loading,
  filtered,
  tempTodo,
  onEditTodo,
  onLoading,
  onError,
}) => {
  const [selected, setSelectedTodo] = useState<number>(0);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtered.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDeleteTodo={onDeleteTodo}
          loading={loading && selected === todo.id}
          selected={selected}
          setSelectedTodo={setSelectedTodo}
          onEditTodo={onEditTodo}
          onLoading={onLoading}
          onError={onError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          onToggle={onToggle}
          onDeleteTodo={onDeleteTodo}
          loading={true}
          selected={selected}
          setSelectedTodo={setSelectedTodo}
          onEditTodo={onEditTodo}
          onLoading={onLoading}
          onError={onError}
        />
      )}
    </section>
  );
};

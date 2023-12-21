import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  todoTemp: Todo | null;
  isProcessing: Todo | null;
  onUpdate: (id: number, todo: Todo) => void;
  isLoading: boolean,
  onProcessing: (todo: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  todoTemp,
  isProcessing,
  onUpdate,
  isLoading,
  onProcessing,
}) => {
  const [isEdited, setIsEdited] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isProcessing={isProcessing}
          onUpdate={onUpdate}
          isEdited={isEdited}
          onEdit={setIsEdited}
          isLoading={isLoading}
          onProcessing={onProcessing}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          onDelete={onDelete}
          isProcessing={isProcessing}
          onUpdate={onUpdate}
          isEdited={isEdited}
          onEdit={setIsEdited}
          isLoading={isLoading}
          onProcessing={onProcessing}
        />
      )}
    </section>
  );
};

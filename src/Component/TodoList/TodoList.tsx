import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  isProcessings: number[];
  onUpdate: (todoId: number, args: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, tempTodo, onDelete, isProcessings, onUpdate,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isProcessings={isProcessings}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};

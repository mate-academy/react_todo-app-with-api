import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  // Nova prop necessária para a renomeação (Rename)
  onUpdateTodo: (todo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodo, // Recebendo a nova função
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          isLoading={processingIds.includes(todo.id)}
          todo={todo}
          onDelete={() => onDeleteTodo(todo.id)}
          onToggle={() => onToggleTodo(todo.id)}
          // Passando a função de atualização para cada item
          onUpdate={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          isLoading={true}
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          // O item temporário não precisa de função de update real
          onUpdate={async () => {}}
        />
      )}
    </section>
  );
};

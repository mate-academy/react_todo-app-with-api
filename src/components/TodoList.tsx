import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onUpdateTodo,
  tempTodo,
  loadingTodoIds,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoCard
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={true}
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};

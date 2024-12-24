import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    loadingTodoIds,
    tempTodo,
    onRemoveTodo,
    onUpdateTodo,
  } = props;

  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isInEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          setEditedTodoId={setEditedTodoId}
          isLoading
        />
      )}
    </section>
  );
};

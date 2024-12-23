import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodoList: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  handleRemoveTodo: (todoId: number) => Promise<void>;
  handleUpdatedTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodoList,
    loadingTodoIds,
    tempTodo,
    handleRemoveTodo,
    handleUpdatedTodo,
  } = props;

  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={handleRemoveTodo}
          onUpdateTodo={handleUpdatedTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isInEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={handleRemoveTodo}
          onUpdateTodo={handleUpdatedTodo}
          setEditedTodoId={setEditedTodoId}
          isLoading
        />
      )}
    </section>
  );
};

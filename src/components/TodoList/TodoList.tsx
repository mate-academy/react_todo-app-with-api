import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent';
import { TodoTemp } from '../TodoTemp';

type Props = {
  todos: Todo[];
  onDeleteTodo: (id: number) => Promise<void>;
  onUpdateTodo: (newTodo: Todo) => Promise<void>;
  isDataLoading: boolean;
  loadingTodosIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const {
    todos,
    onDeleteTodo,
    onUpdateTodo,
    isDataLoading,
    loadingTodosIds,
    tempTodo,
  } = props;

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isDataLoading={isDataLoading}
          isTodoLoading={loadingTodosIds.includes(todo.id)}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />
      ))}

      {tempTodo && <TodoTemp todo={tempTodo} />}
    </section>
  );
};

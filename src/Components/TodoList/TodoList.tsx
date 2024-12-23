import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  tempTodo: null | Todo;
  removeTodo: (todoId: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  loadingTodoIds,
  tempTodo,
  removeTodo,
  updateTodo,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          inEditedMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          isLoading
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};

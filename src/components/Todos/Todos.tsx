import React, { useState } from 'react';

import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => void;
  onCheckedTodo: (todoId: number) => void;
  tempTodoId: number | null;
  temporaryNewTodo?: Todo | null
  loadingTodos?: number[] | null
  handleEditTodo: (modifiedTodo: string, id: number) => void
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onCheckedTodo,
  tempTodoId,
  temporaryNewTodo,
  loadingTodos,
  handleEditTodo,
}) => {
  const [isSelectedTodo, setIsSelectedTodo] = useState<number | null>();

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          onCheckedTodo={onCheckedTodo}
          loading={
            todo.id === tempTodoId
            || loadingTodos?.includes(todo.id)
          }
          isSelectedTodo={isSelectedTodo}
          onSelectedTodo={setIsSelectedTodo}
          handleEditTodo={handleEditTodo}
        />
      ))}
      {
        temporaryNewTodo
        && (
          <TodoItem
            todo={temporaryNewTodo}
            loading
          />
        )
      }
    </section>
  );
};

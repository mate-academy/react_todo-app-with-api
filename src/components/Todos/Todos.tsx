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
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onCheckedTodo,
  tempTodoId,
  temporaryNewTodo,
  loadingTodos,
}) => {
  const [isSelectedTodo, setIsSelectedTodo] = useState<number>();

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
          isSelectedTodo={todo.id === isSelectedTodo}
          onSelectedTodo={setIsSelectedTodo}
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

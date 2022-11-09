import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
};

export const TodosCountInfo: React.FC<Props> = React.memo(({ todos }) => {
  const leftTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)), [todos]);

  return (
    <span className="todo-count" data-cy="todosCounter">
      {`${leftTodos.length} items left`}
    </span>
  );
});

import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[]
}

export const TodosCounter: React.FC<Props> = ({ todos }) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const itemsName = activeTodosCount === 1 ? 'item' : 'items';

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} ${itemsName} left`}
    </span>

  );
};

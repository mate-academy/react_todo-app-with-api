import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[]
  processings: number[]
  onRemove: (id: number) => void
  onUpdate: (todo: Todo) => void
}

export const TodoList: React.FC<Props> = React.memo((
  {
    todos,
    processings,
    onRemove,
    onUpdate,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        todos.map(todo => (
          <TodoItem
            todo={todo}
            processings={processings}
            onRemove={() => onRemove(todo.id)}
            onUpdate={onUpdate}
          />
        ))
      }
    </section>
  );
});

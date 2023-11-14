import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    processingIds,
    onDelete,
    onUpdate,
    tempTodo,
  },
) => {
  const allTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main">
      {
        allTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            processingIds={processingIds}
          />
        ))
      }
    </section>
  );
};

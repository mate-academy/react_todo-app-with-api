import React from 'react';

import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => Promise<number | void>;
  processingTodoIds: number[];
  onUpdate: (id: number, newData: Partial<Todo>) => Promise<void>;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = React.memo((props) => {
  const {
    todos,
    tempTodo,
    onDelete,
    processingTodoIds,
    onUpdate,
    newTodoInputRef: createTodoInputRef,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          hasLoader={processingTodoIds.includes(todo.id)}
          onUpdate={onUpdate}
          createTodoInputRef={createTodoInputRef}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          hasLoader
          onUpdate={onUpdate}
          createTodoInputRef={createTodoInputRef}
        />
      )}
    </section>
  );
});

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  tempTodo?: Todo | null;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
  tempTodo,
  processingTodoIds
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={processingTodoIds.includes(todo.id)}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};

import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (todoId: number) => Promise<boolean>;
  onToggle: (todo: TodoType) => void;
  onUpdate: (todo: TodoType, title: string) => Promise<boolean>;
  processingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onToggle,
  onUpdate,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
          isLoading={processingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <Todo todo={tempTodo} isLoading />}
    </section>
  );
};

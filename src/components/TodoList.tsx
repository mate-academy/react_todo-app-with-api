import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
  onError,
  tempTodo,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onError={onError}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key="temp"
        todo={tempTodo}
        onDelete={() => {}}
        onUpdate={() => Promise.resolve()}
        onError={onError}
      />
    )}
  </>
);

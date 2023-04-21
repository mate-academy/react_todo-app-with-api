import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdateTodo,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </>
  );
};

import React from 'react';
import TodoItem from './Todo';
import { Todo } from './types/Todo';

interface Props {
  visibleTodos:Todo[],
  handleDeleteTodo: (id: number[]) => void;
  handleUpdateTodo: (ids: number[], value: Partial<Todo>) => void;
}

export const TodosList: React.FC<Props>
= ({ visibleTodos, handleDeleteTodo, handleUpdateTodo }) => {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          key={todo.id}
        />
      ))}
    </>
  );
};

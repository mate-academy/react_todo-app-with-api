import React from 'react';
import { Todo } from './Todo';
import { Todo as TypeTodo } from '../types/Todo';

interface TodosListProps {
  filteredTodos: TypeTodo[];
  handleRemoveTodos: (idsToRemove: number[]) => void;
  handleUpdateTodos: (ids: number[], value: Partial<TypeTodo>) => void;
}

export const TodosList: React.FC<TodosListProps> = ({
  filteredTodos,
  handleRemoveTodos,
  handleUpdateTodos,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          temp={false}
          handleRemoveTodos={handleRemoveTodos}
          handleUpdateTodos={handleUpdateTodos}
        />
      ))}
    </>
  );
};

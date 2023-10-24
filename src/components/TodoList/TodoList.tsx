import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../TodosContext';

export const TodoList: React.FC = () => {
  const {
    filtredTodos,
    isLoadingTodo,
    tempTodo,
  } = React.useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoadingTodo.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isLoadingTodo.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};

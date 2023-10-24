import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../TodosContext';

export const TodoList: React.FC = () => {
  const {
    todos,
    deleteTodo,
    updateTodo,
    isLoadingTodo,
    tempTodo,
  } = React.useContext(TodosContext);
  
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteId={deleteTodo}
          updateTodo={updateTodo}
          isLoading={isLoadingTodo.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteId={deleteTodo}
          updateTodo={updateTodo}
          isLoading={isLoadingTodo.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};

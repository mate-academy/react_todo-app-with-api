import React, { useContext } from 'react';
import { TodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, dispatch, handleError, tmpTodo, loading, handleLoading } =
    useContext(TodoContext);

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading.some(id => id === todo.id)}
          dispatch={dispatch}
          handleError={handleError}
          handleLoading={handleLoading}
        />
      ))}

      {tmpTodo && (
        <TodoItem
          key={tmpTodo.id}
          todo={tmpTodo}
          loading={true}
          dispatch={dispatch}
          handleError={handleError}
          handleLoading={handleLoading}
        />
      )}
    </>
  );
};

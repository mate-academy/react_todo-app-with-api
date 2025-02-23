import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    todos,
    dispatch,
    handleError,
    deleteCandidates,
    handleClearCompleted,
    tmpTodo,
    isLoadingAll,
  } = useContext(TodoContext);

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={deleteCandidates.includes(todo.id) || isLoadingAll}
          dispatch={dispatch}
          handleError={handleError}
          onDelete={handleClearCompleted}
          isLoadingAll={false}
        />
      ))}

      {tmpTodo && (
        <TodoItem
          key={tmpTodo.id}
          todo={tmpTodo}
          loading={true}
          dispatch={dispatch}
          handleError={handleError}
          onDelete={handleClearCompleted}
          isLoadingAll={false}
        />
      )}
    </>
  );
};

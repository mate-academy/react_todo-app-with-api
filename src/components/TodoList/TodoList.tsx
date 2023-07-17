import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibleTodos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  todosLoader: boolean,
  isLoadingCompleted: boolean,
}

export const TodoList:React.FC<Props> = ({
  visibleTodos,
  setTodos,
  setErrorMessage,
  todosLoader,
  isLoadingCompleted,
}) => {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todosLoader={todosLoader}
          isLoadingCompleted={isLoadingCompleted}
          key={todo.id}
        />
      ))}
    </>
  );
};

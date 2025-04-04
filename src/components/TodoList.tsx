import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface List {
  tempTodo: Todo | null;
  todos: Todo[];
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  handleTodoDelete: (usersId: number) => void;
  arrTodos: number[];
  delLoader: number | null;
  loaderApi: boolean;
  updatedPost: (updatedPosts: Todo) => void;
  setStateError: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoList: React.FC<List> = ({
  tempTodo,
  todos,
  controlChecked,
  setControlChecked,
  setTodoItem,
  handleTodoDelete,
  arrTodos,
  delLoader,
  loaderApi,
  updatedPost,
  setStateError,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (tempTodo) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [tempTodo]);

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          isTempTodo={false}
          tempTodo={todo}
          controlChecked={controlChecked}
          setControlChecked={setControlChecked}
          setTodoItem={setTodoItem}
          handleTodoDelete={handleTodoDelete}
          arrTodos={arrTodos}
          delLoader={delLoader}
          loaderApi={loaderApi}
          updatedPost={updatedPost}
          setStateError={setStateError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          tempTodo={tempTodo}
          controlChecked={controlChecked}
          setControlChecked={setControlChecked}
          setTodoItem={setTodoItem}
          handleTodoDelete={handleTodoDelete}
          arrTodos={arrTodos}
          delLoader={delLoader}
          isTempTodo={true}
          loaderApi={loaderApi}
          updatedPost={updatedPost}
          setStateError={setStateError}
        />
      )}
    </>
  );
};

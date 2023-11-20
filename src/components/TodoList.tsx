import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todos: Todo[];
  deletePost: (todoId: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<ErrorType | null>>;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    deletePost,
    setTodos,
    setError,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deletePost={deletePost}
          setTodos={setTodos}
          setError={setError}
        />
      ))}
    </section>
  );
};

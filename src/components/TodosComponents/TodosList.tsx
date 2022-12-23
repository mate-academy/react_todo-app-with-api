import React from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { TodoInfo } from './TodosInfo';

type Props = {
  todos: Todo[] | null,
  query: string,
  isAdding: boolean,
  user: User,
  deletingTodo: (id: number) => void,
  idsForLoader: number[];
  changeTodo: (id: number, changes: Partial<Todo>) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  isAdding,
  query,
  user,
  deletingTodo,
  idsForLoader,
  changeTodo,
}) => {
  const todoId0 = {
    id: 0,
    completed: false,
    title: query,
    userId: user.id,
  };

  return (
    <>
      {todos?.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          deletingTodo={deletingTodo}
          idsForLoader={idsForLoader}
          changeTodo={changeTodo}
        />
      ))}

      {isAdding && (
        <TodoInfo
          todo={todoId0}
          isAdding={isAdding}
          idsForLoader={idsForLoader}
          changeTodo={changeTodo}
        />
      )}
    </>
  );
};

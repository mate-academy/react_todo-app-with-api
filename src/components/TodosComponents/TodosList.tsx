import React from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { TodoInfo } from './TodosInfo';

type Props = {
  todos: Todo[] | null,
  query: string,
  isAdding: boolean,
  user: User,
  DeletingTodo: (id: number) => void,
  idsForLoader: number[];
  changeTodo: (id: number, changes: Partial<Todo>) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  isAdding,
  query,
  user,
  DeletingTodo,
  idsForLoader,
  changeTodo,
}) => {
  return (
    <>
      {todos?.map(todo => (
        <TodoInfo
          key={todo.id}
          todos={todo}
          deletingTodo={DeletingTodo}
          idsForLoader={idsForLoader}
          changeTodo={changeTodo}
        />
      ))}

      {isAdding && (
        <TodoInfo
          todos={
            {
              id: 0,
              completed: false,
              title: query,
              userId: user.id,
            }
          }
          isAdding={isAdding}
          idsForLoader={idsForLoader}
          changeTodo={changeTodo}
        />
      )}
    </>
  );
};

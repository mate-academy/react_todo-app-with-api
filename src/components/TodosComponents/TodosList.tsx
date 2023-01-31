import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { LoaderContext } from '../Context/LoadingContext';
import { QueryContext } from '../Context/QueryContext';
import { TodoInfo } from './TodosInfo';

type Props = {
  todos: Todo[] | null,
  user: User,
  deletingTodo: (id: number) => void,
  changeTodo: (id: number, changes: Partial<Todo>) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  user,
  deletingTodo,
  changeTodo,
}) => {
  const { query } = useContext(QueryContext);
  const { isAdding } = useContext(LoaderContext);

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
          changeTodo={changeTodo}
        />
      ))}

      {isAdding && (
        <TodoInfo
          todo={todoId0}
          isAdding={isAdding}
          changeTodo={changeTodo}
        />
      )}
    </>
  );
};

import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  isLoadingTodo: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdateTodo,
  setTodos,
  isLoadingTodo,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onUpdateTodo={onUpdateTodo}
          todos={todos}
          setTodos={setTodos}
          isLoadingTodo={isLoadingTodo}
        />
      ))}
    </>
  );
};

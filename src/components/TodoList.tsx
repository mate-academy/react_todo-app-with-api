import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../utils/ErrorMessages';

type Props = {
  updateTodo: (arg: Todo) => Promise<Todo | void>,
  filteredTodos: Todo[],
  loadingId: number[],
  setLoadingId: (arg: number[] | []) => void,
  handleDeleteTodo: (id: number) => Promise<void>,
  setErrorMessage: (error: ErrorMessages) => void,
};

export const TodoList: React.FC<Props> = ({
  updateTodo,
  filteredTodos,
  loadingId,
  setLoadingId,
  handleDeleteTodo,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateTodo={updateTodo}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
          handleDeleteTodo={handleDeleteTodo}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { LoadingTodo } from './LoadingTodo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  title: string,
  setErrorMessage: (value: string) => void;
  deleteTodo: (id: number) => void;
  togleStatus: (
    id: number,
    completed: boolean,
    activateLoader:(val: boolean) => void) => void;
  activeTodosId: number[];
};

export const TodoList:React.FC<Props> = ({
  todos,
  isAdding,
  title,
  setErrorMessage,
  deleteTodo,
  togleStatus,
  activeTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map((todo: Todo) => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            setErrorMessage={setErrorMessage}
            togleStatus={togleStatus}
            deleteTodo={deleteTodo}
            activeTodosId={activeTodosId}
          />
        ))}

        {isAdding && <LoadingTodo title={title} />}
      </ul>
    </section>
  );
};

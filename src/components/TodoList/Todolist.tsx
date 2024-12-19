/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TempTodoItem } from '../TempTodoItem';
import { TodoElement } from '../TodoElement';

type Props = {
  filteredTodos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => Promise<void>;
  tempTodo: Todo | null;
  loadingIds: number[];
  setErrorMessage: (message: string) => void;
  deleteError: () => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  updateTodo,
  tempTodo,
  loadingIds,
  setErrorMessage,
  deleteError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoElement
          filteredTodos={filteredTodos}
          updateTodo={updateTodo}
          loadingIds={loadingIds}
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          setErrorMessage={setErrorMessage}
          deleteError={deleteError}
        />
      ))}
      {tempTodo && <TempTodoItem todo={tempTodo} />}
    </section>
  );
};

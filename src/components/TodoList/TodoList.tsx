/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../../types/Todo';

import { TodoInfo } from '../TodoInfo';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  todosForUpdate: Todo[];
  idsForDelete: number[];
  error: ErrorMessages;
  onTodosChange: (newTodos: Todo[]) => void;
  onDeleteTodo: (ids: number[]) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  todosForUpdate,
  idsForDelete,
  error,
  onTodosChange,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            todosForUpdate={todosForUpdate}
            onTodosChange={onTodosChange}
            idsForDelete={idsForDelete}
            onDeleteTodo={onDeleteTodo}
            error={error}
          />
        );
      })}
      {tempTodo && <TodoInfo todo={tempTodo} />}
    </section>
  );
};

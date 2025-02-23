import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoBody } from '../TodoBody';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletionIds: number[];
  pendingTodos: Todo[] | undefined;
  errorMessage: Errors;
  onTodosChange: (newTodos: Todo[]) => void;
  onDeleteTodos: (ids: number[]) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  deletionIds,
  pendingTodos,
  errorMessage,
  onTodosChange,
  onDeleteTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoBody
          key={todo.id}
          todo={todo}
          deletionIds={deletionIds}
          pendingTodos={pendingTodos}
          errorMessage={errorMessage}
          onTodosChange={onTodosChange}
          onDeleteTodos={onDeleteTodos}
        />
      ))}
      {tempTodo && <TodoBody todo={tempTodo} errorMessage={errorMessage} />}
    </section>
  );
};

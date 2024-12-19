/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/Todo';
import { Loading } from '../types/Loading';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingId: Loading;
  onEdit: (
    todo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  onDelete: (todoID: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, tempTodo, loadingId, onEdit, onDelete } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingId={loadingId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loadingId={loadingId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};

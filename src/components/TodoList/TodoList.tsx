/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingIds: number[];
  onChange: (updTodo: Todo) => void;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  onChange,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={
            deletingIds.includes(todo.id) || loadingIds.includes(todo.id)
          }
          onChange={onChange}
        />
      ))}
    </section>
  );
};

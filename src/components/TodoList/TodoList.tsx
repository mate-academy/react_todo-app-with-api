import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  refInputAdd: HTMLInputElement | null;
  prepareTodos: () => Todo[];
  deletedId: number[];
  tempTodo: Todo | null;
  handleDelete: (id: number, el: HTMLInputElement | null) => Promise<number>;
  updateTodo: (todoId: number, updatePart: string | boolean) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  refInputAdd,
  prepareTodos,
  handleDelete,
  deletedId,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {prepareTodos().map(todo => (
        <TodoItem
          key={todo.id}
          title={todo.title}
          completed={todo.completed}
          isLoading={false}
          deletedId={deletedId}
          id={todo.id}
          handleDelete={handleDelete}
          updateTodo={updateTodo}
          refInputAdd={refInputAdd}
        />
      ))}
      {!!tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={tempTodo.completed}
          isLoading={true}
        />
      )}
    </section>
  );
};

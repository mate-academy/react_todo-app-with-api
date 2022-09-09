import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  loading: boolean,
  onChecked: (todoId: number, data: {}) => void,
  onChangeTitle: (todoId: number, title: string) => void,
  onRemove: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onChecked,
  onChangeTitle,
  onRemove,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          onChecked={onChecked}
          onChangeTitle={onChangeTitle}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
};

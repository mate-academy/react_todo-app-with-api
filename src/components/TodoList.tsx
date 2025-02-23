/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  todoToDelete: number[];
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoToUpdate: Todo) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  todoToDelete,
  onDeleteTodo,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        todoToDelete={todoToDelete}
        handleDeleteTodo={onDeleteTodo}
        handleUpdateTodo={onUpdateTodo}
      />
    ))}
  </section>
);

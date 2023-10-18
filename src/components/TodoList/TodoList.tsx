import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeComplatedTodos: (id: number[]) => void,
  removeTodoTitle: (id: number) => Promise<void | null>,
  deletedTodo?: number[] | null,
  updateTodoStatus: (t: Todo) => void,
  updateTitleTodo: (t: Todo) => Promise<void | Todo>
  changedTodo: number[] | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeComplatedTodos,
  deletedTodo,
  updateTodoStatus,
  changedTodo,
  updateTitleTodo,
  removeTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          updateTitleTodo={updateTitleTodo}
          key={todo.id}
          todo={todo}
          removeComplatedTodos={removeComplatedTodos}
          deletedTodo={deletedTodo}
          updateTodoStatus={updateTodoStatus}
          changedTodo={changedTodo}
          removeTodoTitle={removeTodoTitle}
        />
      ))}
    </section>
  );
};

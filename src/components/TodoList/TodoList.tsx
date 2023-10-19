import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeCompletedTodos: (id: number[]) => void,
  removeTodoTitle: (id: number) => Promise<void | null>,
  deletedTodo?: number[],
  updateTodoStatus: (t: Todo) => void,
  updateTitleTodo: (t: Todo) => Promise<void | Todo>
  changedTodo: number[],
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  removeCompletedTodos,
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
          removeCompletedTodos={removeCompletedTodos}
          deletedTodo={deletedTodo}
          updateTodoStatus={updateTodoStatus}
          changedTodo={changedTodo}
          removeTodoTitle={removeTodoTitle}
        />
      ))}
    </section>
  );
});

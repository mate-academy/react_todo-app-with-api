import { FC } from 'react';
import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<boolean>;
  tempTodo: Todo | null;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
  checkTodo(todoId: number, newStatus: boolean): Promise<boolean>;
};
export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  renameTodo,
  checkTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          renameTodo={renameTodo}
          checkTodo={checkTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isTemp
          renameTodo={renameTodo}
          checkTodo={checkTodo}
        />
      )}
    </section>
  );
};

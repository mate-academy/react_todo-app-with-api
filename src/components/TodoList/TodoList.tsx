import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  temporaryTodo: Todo | null,
  removeTodoOnServer: (id:number) => void,
  updateTodoOnServer: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = (
  {
    todos, temporaryTodo, removeTodoOnServer, updateTodoOnServer,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodoOnServer={removeTodoOnServer}
          updateTodoOnServer={updateTodoOnServer}
        />
      ))}

      {temporaryTodo
      && (
        <TodoItem
          todo={temporaryTodo}
          removeTodoOnServer={removeTodoOnServer}
          updateTodoOnServer={updateTodoOnServer}
          withLoader
        />
      )}
    </section>
  );
};

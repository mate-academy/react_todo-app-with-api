import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodoOnServer: (id: number) => void,
  updateTodoOnServer: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodoOnServer,
  updateTodoOnServer,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        removeTodoOnServer={removeTodoOnServer}
        updateTodoOnServer={updateTodoOnServer}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        removeTodoOnServer={removeTodoOnServer}
        updateTodoOnServer={updateTodoOnServer}
        isLoader
      />
    )}
  </section>
);

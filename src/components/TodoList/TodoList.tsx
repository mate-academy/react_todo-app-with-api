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
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            removeTodoOnServer={removeTodoOnServer}
            updateTodoOnServer={updateTodoOnServer}
          />
        </li>
      ))}
      {tempTodo && (
        <li>
          <TodoItem
            todo={tempTodo}
            removeTodoOnServer={removeTodoOnServer}
            updateTodoOnServer={updateTodoOnServer}
            isLoader
          />
        </li>
      )}
    </ul>
  </section>
);

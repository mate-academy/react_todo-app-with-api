import React from 'react';
import { Todo } from '../../types/Todo';
import { UserTodo } from '../Todo';

type Props = {
  todos: Todo[];
  todoDelete: (todo: Todo) => void;
  visibleLoader: boolean;
  updateCompleteTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, title: string) => void;
  newTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoDelete,
  visibleLoader,
  updateCompleteTodo,
  updateTodoTitle,
  newTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <UserTodo
              todo={todo}
              todoDelete={todoDelete}
              visibleLoader={visibleLoader}
              updateCompleteTodo={updateCompleteTodo}
              updateTodoTitle={updateTodoTitle}
              newTodoId={newTodoId}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  updateTodo: (id: number, data: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    deleteTodo,
    updateTodo,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          )}
        </ul>
      </section>
    );
  },
);

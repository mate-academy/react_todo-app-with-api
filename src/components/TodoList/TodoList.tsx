import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    deleteTodo,
    updateTodo,
    deletingTodoIds,
    updatingTodoIds,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            shouldShowLoader={deletingTodoIds.includes(todo.id)
              || updatingTodoIds.includes(todo.id)}
          />
        ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            shouldShowLoader
          />
        )}
      </section>
    );
  },
);

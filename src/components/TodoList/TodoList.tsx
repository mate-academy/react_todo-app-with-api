import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: null | Todo;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    tempTodo,
    deleteTodo,
    updateTodo,
    loadingTodoIds,
  },
) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        ))
      }
      {
        tempTodo
        && (
          <TodoItem
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
          />
        )
      }
    </section>
  );
};

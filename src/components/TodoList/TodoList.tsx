import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (
    todoId: number,
    newTodoData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};

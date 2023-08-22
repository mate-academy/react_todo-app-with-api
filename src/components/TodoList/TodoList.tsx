import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  onUpdateTodoStatus: (todo: Todo) => void;
  onUpdateTodo: (todoId: number, netTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  deleteTodo,
  onUpdateTodoStatus,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          onUpdateTodoStatus={onUpdateTodoStatus}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          onUpdateTodoStatus={onUpdateTodoStatus}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};

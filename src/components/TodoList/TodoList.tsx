import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number, finallyCallback?: () => void) => void;
  loadingTodos: number[];
  handleUpdateTodo: (
    todoId: number,
    updatedData: {},
    finallyCallback?: () => void,
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  loadingTodos,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodos={loadingTodos}
          handleUpdateTodo={handleUpdateTodo}
        />
      )}
    </section>
  );
};

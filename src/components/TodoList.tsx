import React from 'react';
import { Todo } from '../types/Todo';
import { TodoDetails } from './TodoDetails';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  newTodo: Todo | null,
  isLoading: boolean,
  deleteTodo: (todoId: number) => void,
  loadingTodoIds: number[],
  updateTodoData: (todoId: number, data: object) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTodo,
  isLoading,
  deleteTodo,
  loadingTodoIds,
  updateTodoData,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoDetails
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isActive={isLoading}
          loadingTodoIds={loadingTodoIds}
          updateTodoData={updateTodoData}
        />
      ))}

      {newTodo && (
        <TodoDetails
          todo={newTodo}
          deleteTodo={deleteTodo}
          isActive={isAdding}
          loadingTodoIds={loadingTodoIds}
          updateTodoData={updateTodoData}
        />
      )}
    </section>
  );
};

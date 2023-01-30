import React from 'react';
import { Todo } from '../types/Todo';
import { TodoDetails } from './TodoDetails';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  newTodo: Todo | null,
  isLoading: boolean,
  deleteTodo: (todoId: number) => void,
  deletedTodoIds: number[],
  activeTodoIds: number[],
  updateTodoData: (todoId: number, data: object) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  newTodo,
  isLoading,
  deleteTodo,
  deletedTodoIds,
  activeTodoIds,
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
          deletedTodoIds={deletedTodoIds}
          activeTodoIds={activeTodoIds}
          updateTodoData={updateTodoData}
        />
      ))}

      {newTodo && (
        <TodoDetails
          todo={newTodo}
          deleteTodo={deleteTodo}
          isActive={isAdding}
          deletedTodoIds={deletedTodoIds}
          activeTodoIds={activeTodoIds}
          updateTodoData={updateTodoData}
        />
      )}
    </section>
  );
};

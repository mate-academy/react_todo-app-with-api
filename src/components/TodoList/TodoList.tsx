import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isNewTodoLoading: boolean,
  newTodoField: React.RefObject<HTMLInputElement>,
  toggleTodoStatus: (todoId: number, checked: boolean) => void,
  updatingTodos: number[],
  updateTodoTitle: (
    todoId: number,
    newTitle: string,
  ) => void,
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  deleteTodo,
  tempTodo,
  isNewTodoLoading,
  newTodoField,
  toggleTodoStatus,
  updatingTodos,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          newTodoField={newTodoField}
          toggleTodoStatus={toggleTodoStatus}
          shouldTodoUpdate={updatingTodos.includes(todo.id)}
          updateTodoTitle={updateTodoTitle}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          key={tempTodo?.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isNewTodoLoading={isNewTodoLoading}
          newTodoField={newTodoField}
          toggleTodoStatus={toggleTodoStatus}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
});

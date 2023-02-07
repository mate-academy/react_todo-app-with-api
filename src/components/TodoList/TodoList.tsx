import React from 'react';
import { ErrorType } from '../../types/ErrorType';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo: TempTodo | null,
  setTodos: (todos: Todo[]) => void,
  setError: (message: ErrorType) => void,
  addedTodoIsLoading: boolean,
};

const getVisibleTodosByFilter = (todos: Todo[], filterStatus: FilterStatus) => {
  return todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterStatus,
  setTodos,
  setError,
  tempTodo,
  addedTodoIsLoading,

}) => {
  const visibleTodos = getVisibleTodosByFilter(todos, filterStatus);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          key={tempTodo.id}
          todo={tempTodo}
          addedTodoIsLoading={addedTodoIsLoading}
        />
      )}
    </section>
  );
};

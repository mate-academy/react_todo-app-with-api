import React from 'react';
import { ErrorType } from '../../types/ErrorType';
import { FilterBy } from '../../types/FilterBy';
import { TempTodo, Todo } from '../../types/Todo';
import { getVisibleTodosByFilter } from '../../utils/filterTodos';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterBy: FilterBy;
  tempTodo: TempTodo | null,
  setTodos: (todos: Todo[]) => void,
  setError: (message: ErrorType) => void,
  addedTodoIsLoading: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterBy,
  setTodos,
  setError,
  tempTodo,
  addedTodoIsLoading,
}) => {
  const visibleTodos = getVisibleTodosByFilter(todos, filterBy);

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

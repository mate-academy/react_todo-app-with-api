/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo } from 'react';
import { Todo } from './types/Todo';
import { FilterButtons } from './types/FilterType';
import { ToDoItem } from './ToDoItem';
import { TempTodoItem } from './TempTodoItem';
import { Errors } from './types/EnumedErrors';
type Props = {
  todos: Todo[];
  filter: FilterButtons;
  deleteTodo: (idNumber: number) => Promise<void>;
  loadingTodos: number[];
  temporaryTodo: Todo | null;
  editTodo: (todo: Todo) => Promise<void>;
  setError: (error: Errors) => void;
};

export const TodoList = ({
  todos,
  filter,
  deleteTodo,
  loadingTodos,
  temporaryTodo,
  editTodo,
  setError,
}: Props) => {
  const filteredTodos = (filtrTodos: Todo[], filterStatus: FilterButtons) => {
    const updateTodos = [...filtrTodos];

    if (filterStatus) {
      switch (filterStatus) {
        case FilterButtons.Active:
          return updateTodos.filter(todo => !todo.completed);
        case FilterButtons.Completed:
          return updateTodos.filter(todo => todo.completed);
        default:
          break;
      }
    }

    return updateTodos;
  };

  const filteringTodos: Todo[] = useMemo(
    () => filteredTodos(todos, filter),
    [todos, filter],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.length > 0 &&
        filteringTodos.map(todo => (
          <ToDoItem
            todo={todo}
            key={todo.id}
            deleteTodo={deleteTodo}
            isLoading={loadingTodos.includes(todo.id)}
            editTodo={editTodo}
            setError={setError}
          />
        ))}

      {temporaryTodo && <TempTodoItem todo={temporaryTodo} />}
    </section>
  );
};

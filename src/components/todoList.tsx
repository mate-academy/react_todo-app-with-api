import React from 'react';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/filterOption';
import { Task } from './task';

interface Props {
  todos: Todo[];
  filterTodos: FilterOption;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoList: React.FC<Props> = ({ todos, filterTodos, setTodos }) => {
  const visibleTodos = (() => {
    let filteredTodos = todos;

    if (filterTodos === FilterOption.ACTIVE) {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed);
    } else if (filterTodos === FilterOption.COMPLETED) {
      filteredTodos = filteredTodos.filter((todo) => todo.completed);
    }

    filteredTodos = filteredTodos.filter((todo) => !todo.removed);

    return filteredTodos;
  })();

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <Task key={todo.id} todo={todo} setTodos={setTodos} todos={todos} />
      ))}
    </section>
  );
};

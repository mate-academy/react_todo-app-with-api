import React, { useState } from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../utils/todos';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setFilter: (value: Filter) => void,
  completedTodos: Todo[] | [],
  setError: (value: string) => void,
  setIsDisable: (value: boolean) => void,
  setIsHiddenClass: (value: boolean) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  setFilter,
  completedTodos,
  setError,
  setIsDisable,
  setIsHiddenClass,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(Filter.All);

  const filters = Object.values(Filter).map((filter) => ({
    filter,
    label: filter.charAt(0).toUpperCase() + filter.slice(1),
  }));

  const handleFilterClick = (filter: Filter) => {
    setSelectedFilter(filter);
    setFilter(filter);
  };

  const completedTodoCount = todos.filter(todo => !todo.completed).length;

  const handleDeleteTodo = async (todoId: number) => {
    setIsDisable(true);
    try {
      const isTodoDelete = await deleteTodo(todoId);

      if (!isTodoDelete) {
        setTodos((prevTodos: Todo[]) => prevTodos.map((t) => {
          if (t.id === todoId) {
            return { ...t, completed: false };
          }

          return t;
        }));

        setError('Unable to delete a todo');
        setIsHiddenClass(false);
      } else {
        setTodos((prevTodos: Todo[]) => prevTodos.filter(t => t.id !== todoId));
      }
    } catch (error) {
      setError('Unable to delete a todo');
      setIsHiddenClass(false);
    } finally {
      setIsDisable(false);
    }
  };

  const deleteAllCompleted = async () => {
    const allCompleted = todos.filter(t => t.completed);

    await Promise.allSettled(allCompleted.map(todo => (
      handleDeleteTodo(todo.id)
    )));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedTodoCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ filter, label }) => (
          <a
            key={filter}
            href={filter === Filter.All ? '#/' : `#/${filter.toLowerCase()}`}
            className={`filter__link ${selectedFilter === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={() => handleFilterClick(filter)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>

    </footer>
  );
};

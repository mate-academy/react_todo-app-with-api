import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import { deleteTodos } from '../api/todos';

type Props = {
  todos: Todo[];
  todosArray: Todo[];
  setFilter: (value: Filter) => void;
  filter: Filter;
  setTodos: (value: React.SetStateAction<Todo[]>) => void,
  setTodosError: (error: ErrorMessage) => void;
  setIsLoading: (value: boolean | number) => void;
  setProcDelete: (value: boolean) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  todosArray,
  setFilter,
  filter,
  setTodos,
  setTodosError,
  setIsLoading,
  setProcDelete,
}) => {
  const completedTodos = todosArray.filter(todo => todo.completed).length;
  const countTodos = todosArray.filter(todo => !todo.completed).length;

  const deleteTodoCompletedHandler = async () => {
    setIsLoading(true);
    setProcDelete(true);

    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      await Promise.all(completedTodoIds.map(async id => {
        await deleteTodos(id);
      }));
      setTimeout(() => {
        setIsLoading(false);
        setProcDelete(false);
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      }, 3000);
    } catch (error) {
      setTodosError(ErrorMessage.UnableToDeleteTodo);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodos} items left`}
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        {Object.values(Filter).map((value) => (
          <a
            key={value}
            href={`#/${value.toLowerCase()}`}
            className={cn(
              'filter__link', { selected: filter === value },
            )}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilter(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={deleteTodoCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};

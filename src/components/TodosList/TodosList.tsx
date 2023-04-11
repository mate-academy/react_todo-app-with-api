import React, { useState } from 'react';
import classNames from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../enums/FilterType';

interface Props {
  todos: Todo[],
  tempTodo: Todo | undefined,
  onDeleteTodo: (id: number) => void,
  onDeleteCompleted: () => void,
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
  completedId: number[],
  isDeleting: boolean,
}

const filterTodos = (
  todos: Todo[],
  filterMethod: FilterType,
): Todo[] => {
  switch (filterMethod) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const TodosList: React.FC<Props> = (
  {
    todos,
    tempTodo,
    onDeleteTodo,
    onDeleteCompleted,
    onUpdateTodo,
    completedId,
    isDeleting,
  },
) => {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const visibleTodos = filterTodos(todos, filterType);
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map((todo) => {
          const isLoading = completedId.some(id => id === todo.id)
          || (isDeleting && completedTodos.some(item => item.id === todo.id));

          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              isLoading={isLoading}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDeleteTodo={() => {}}
          onUpdateTodo={onUpdateTodo}
          isLoading
        />
      )}

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos} ${activeTodos === 1 ? 'item' : 'items'} left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              { selected: filterType === FilterType.All },
            )}
            onClick={() => {
              if (filterType !== FilterType.All) {
                setFilterType(FilterType.All);
              }
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              { selected: filterType === FilterType.Active },
            )}
            onClick={() => {
              if (filterType !== FilterType.Active) {
                setFilterType(FilterType.Active);
              }
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              { selected: filterType === FilterType.Completed },
            )}
            onClick={() => {
              if (filterType !== FilterType.Completed) {
                setFilterType(FilterType.Completed);
              }
            }}
          >
            Completed
          </a>
        </nav>

        {completedTodos.length && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={onDeleteCompleted}
          >
            Clear completed
          </button>
        )}

      </footer>
    </>
  );
};

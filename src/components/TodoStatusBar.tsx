import classNames from 'classnames';
import {
  Dispatch, FC, SetStateAction, useMemo,
} from 'react';
import { deleteTodo } from '../api/todos';
import { FilterType, Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  changeFilter: (filterType: FilterType) => void,
  filterType: FilterType,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  setSelectedTodoIds: Dispatch<React.SetStateAction<number[]>>,
}

export const TodoStatusBar: FC<Props> = (props) => {
  const {
    todos,
    changeFilter,
    filterType,
    setTodos,
    setErrorMessages,
    setSelectedTodoIds,
  } = props;

  const itemsLeft = useMemo(() => {
    const todosLeft = [...todos];

    return todosLeft.filter(todo => todo.completed === false).length;
  }, [todos]);

  const displayClearCompleted = useMemo<boolean>(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const onDelete = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter(prevTodo => prevTodo.id !== id));
  };

  const clearCompletedHandler = (todosToDelete: Todo[]) => {
    const ids = todosToDelete.map(todo => todo.id);

    setErrorMessages([]);
    setSelectedTodoIds(prev => [...prev, ...ids]);

    todosToDelete.forEach(element => {
      deleteTodo(element.id)
        .then(responce => {
          if (responce) {
            onDelete(element.id);
          }
        })
        .catch(() => {
          setErrorMessages(
            (prev: string []) => [...prev, 'Unable to delete a todo'],
          );
        })
        .finally(() => {
          setSelectedTodoIds(prev => prev.filter(
            someId => someId !== element.id,
          ));
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => changeFilter(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => changeFilter(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => changeFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {displayClearCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompletedHandler(
            todos.filter(todo => todo.completed),
          )}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};

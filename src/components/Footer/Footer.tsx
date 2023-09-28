import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodosContextProvider/TodosContextProvider';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';
import { Filter } from '../Filter/Filter';
import { FilterKey } from '../../types/FilterKey';

type Props = {
  filterKey: FilterKey,
  setFilterKey: React.Dispatch<React.SetStateAction<FilterKey>>,
};

export const Footer: React.FC<Props> = ({ filterKey, setFilterKey }) => {
  const { todos, setTodos, setTodoIdsWithLoader } = useContext(TodosContext);
  const { onNewError, setErrorMessage } = useContext(ErrorContext);
  const activeTodos = todos.filter(({ completed }) => !completed);
  const hasCompletedTodo = todos.some(({ completed }) => completed);

  const handleCompletedTodosDelete = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    setTodoIdsWithLoader(prevTodoIds => {
      return [...prevTodoIds, ...completedTodos.map(({ id }) => id)];
    });
    setErrorMessage(ErrorMessage.None);

    Promise.all(completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todo.id));
        })
        .catch(() => onNewError(ErrorMessage.UnableDelete))
        .finally(() => setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter((id) => todo.id !== id),
        ));
    }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length === 1
          ? '1 item left'
          : `${activeTodos.length} items left`}
      </span>
      <Filter
        filterKey={filterKey}
        onClick={setFilterKey}
      />
      <button
        type="button"
        data-cy="ClearCompletedButton"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': !hasCompletedTodo,
        })}
        onClick={handleCompletedTodosDelete}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};

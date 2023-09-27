import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { Filter } from '../Filter/Filter';
import { NewTodo } from '../NewTodo/NewTodo';
import { TodoList } from '../TodoList/TodoList';
import {
  TodosContext,
} from '../TodosContextProvider/TodosContextProvider';
import { TodoError } from '../TodoError/TodoError';
import { deleteTodo, getTodos, updateTodo } from '../../api/todos';
import { FilterKey } from '../../types/FilterKey';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/UserId';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';
import { ErrorMessage } from '../../types/ErrorMessage';

function getFilteredTodos(key: FilterKey, todos: Todo[]) {
  switch (key) {
    case FilterKey.All:
      return todos;
    case FilterKey.Active:
      return todos.filter(({ completed }) => !completed);
    case FilterKey.Completed:
      return todos.filter(({ completed }) => completed);
    default:
      return todos;
  }
}

export const TodoApp = () => {
  const { onNewError, setErrorMessage } = useContext(ErrorContext);
  const { todos, setTodos, setTodoIdsWithLoader } = useContext(TodosContext);
  const [filterKey, setFilterKey] = useState<FilterKey>(FilterKey.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const isAllTodosCompleted = todos.every(({ completed }) => completed);
  const visibleTodos = useMemo(
    () => getFilteredTodos(filterKey, todos),
    [todos, filterKey],
  );
  const activeTodos = todos.filter(({ completed }) => !completed);
  const hasCompletedTodo = todos.some(({ completed }) => completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => onNewError(ErrorMessage.UnableLoad));
  }, []);

  const handleAllTodosToggle = () => {
    const todosToUpdate = todos.filter(
      ({ completed }) => completed === isAllTodosCompleted,
    );

    setTodoIdsWithLoader(
      prevTodoIds => [...prevTodoIds, ...todosToUpdate.map(({ id }) => id)],
    );
    setErrorMessage(ErrorMessage.None);

    todosToUpdate.forEach(todo => {
      updateTodo(todo.id, { completed: !todo.completed })
        .then(() => {
          const todosCopy = [...todos];
          const searchedTodo = todos.find(
            ({ id }) => todo.id === id,
          ) as Todo;

          searchedTodo.completed = !searchedTodo.completed;

          setTodos(todosCopy);
        })
        .catch(() => onNewError(ErrorMessage.UnableUpdate))
        .finally(() => setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter((todoId) => todoId !== todo.id),
        ));
    });
  };

  const handleCompletedTodosDelete = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    setTodoIdsWithLoader(prevTodoIds => {
      return [...prevTodoIds, ...completedTodos.map(({ id }) => id)];
    });
    setErrorMessage(ErrorMessage.None);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todo.id));
        })
        .catch(() => onNewError(ErrorMessage.UnableDelete))
        .finally(() => setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter((id) => todo.id !== id),
        ));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
              aria-label="toggle_all_todos"
              onClick={handleAllTodosToggle}
            />
          )}

          <NewTodo
            setTempTodo={setTempTodo}
            tempTodo={tempTodo}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
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
        )}

        <TodoError />
      </div>
    </div>
  );
};

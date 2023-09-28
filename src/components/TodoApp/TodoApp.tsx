import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { NewTodo } from '../NewTodo/NewTodo';
import { TodoList } from '../TodoList/TodoList';
import {
  TodosContext,
} from '../TodosContextProvider/TodosContextProvider';
import { TodoError } from '../TodoError/TodoError';
import { getTodos, updateTodo } from '../../api/todos';
import { FilterKey } from '../../types/FilterKey';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/UserId';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';
import { ErrorMessage } from '../../types/ErrorMessage';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { Footer } from '../Footer/Footer';

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

    Promise.all(todosToUpdate.map(todo => {
      return updateTodo(todo.id, { completed: !todo.completed })
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
    }));
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
          <Footer filterKey={filterKey} setFilterKey={setFilterKey} />
        )}

        <TodoError />
      </div>
    </div>
  );
};

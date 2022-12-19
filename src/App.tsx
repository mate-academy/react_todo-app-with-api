/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updatingTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotifications/ErrorNotifications';
import { TodosFooter } from './components/TodosComponents/TodosFooter';
import { TodosHeader } from './components/TodosComponents/TodosHeader';
import { TodosList } from './components/TodosComponents/TodosList';
import { ErrorValues } from './types/ErrorValues';
import { FilterValues } from './types/FilterValues';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState(FilterValues.ALL);
  const [errorStatus, setErrorStatus] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(ErrorValues.DEFAULT);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [idsForLoader, setIdsForLoader] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getErrorStatus = (currentError: ErrorValues) => {
    setErrorMessage(currentError);

    setErrorStatus(true);

    const handleId = setTimeout(() => {
      setErrorStatus(false);

      setErrorMessage(ErrorValues.DEFAULT);
    }, 3000);

    setTimerId(handleId);

    if (timerId) {
      clearTimeout(timerId);
    }
  };

  const setterErrorStatus = (errStatus: boolean) => {
    setErrorStatus(errStatus);
  };

  const setterOfQuery = (settedQuery: string) => {
    setQuery(settedQuery);
  };

  const reloadTodos = async () => {
    if (user) {
      try {
        const response = await getTodos(user.id);

        setTodos(response);
      } catch (error) {
        getErrorStatus(ErrorValues.SERVER);
      }
    }
  };

  const addingTodos = async () => {
    if (user) {
      try {
        setIsAdding(true);

        await addTodo({
          completed: false,
          title: query,
          userId: user.id,
        });

        await reloadTodos();

        setQuery('');

        setIsAdding(false);
      } catch (error) {
        setIsAdding(false);
        getErrorStatus(ErrorValues.ADD);
      }
    }
  };

  const deletingTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await reloadTodos();
    } catch (error) {
      getErrorStatus(ErrorValues.DELETE);
    }
  };

  const deleteAllCompleted = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed === true);

      setIdsForLoader(completedTodos
        .map(idForLoaderDeleting => idForLoaderDeleting.id));

      await Promise.all(completedTodos.map(todo => deletingTodo(todo.id)));

      setIdsForLoader([]);
    } catch (error) {
      getErrorStatus(ErrorValues.DELETE);
    }
  };

  const changeTodo = async (id: number, changes: Partial<Todo>) => {
    try {
      await updatingTodo(id, changes);
      await reloadTodos();
    } catch (error) {
      getErrorStatus(ErrorValues.UPDATE);
    }
  };

  const changeAllTodosStatus = async () => {
    try {
      const todosToFalse = todos.filter(todo => todo.completed === false);

      if (todosToFalse.length > 0) {
        setIdsForLoader(todosToFalse
          .map(change => change.id));

        await Promise.all(todosToFalse
          .map(todo => updatingTodo(todo.id, { completed: true })));

        await reloadTodos();

        setIdsForLoader([]);
      } else {
        setIdsForLoader(todos
          .map(change => change.id));

        await Promise.all(todos
          .map(todo => updatingTodo(todo.id, { completed: false })));

        await reloadTodos();

        setIdsForLoader([]);
      }
    } catch (error) {
      getErrorStatus(ErrorValues.UPDATE);
      setIdsForLoader([]);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    reloadTodos();
  }, []);

  const setFilterStatus = (todoStatus: FilterValues) => {
    setTodoFilter(todoStatus);
  };

  let visibleTodos = [...todos];

  if (todoFilter !== FilterValues.ALL) {
    visibleTodos = visibleTodos
      .filter(completedTodo => {
        switch (todoFilter) {
          case (FilterValues.ACTIVE):
            return completedTodo.completed === true;

          case (FilterValues.COMPLETED):
            return completedTodo.completed === false;

          default:
            return 0;
        }
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todos}
          newTodoField={newTodoField}
          query={query}
          isAdding={isAdding}
          changeAllTodosStatus={changeAllTodosStatus}
          AddingTodos={addingTodos}
          getErrorStatus={getErrorStatus}
          onSetterOfQuery={setterOfQuery}
        />

        {todos.length > 0 && user && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodosList
                user={user}
                todos={visibleTodos}
                query={query}
                isAdding={isAdding}
                DeletingTodo={deletingTodo}
                idsForLoader={idsForLoader}
                changeTodo={changeTodo}
              />
            </section>

            <TodosFooter
              todos={todos}
              todoFilter={todoFilter}
              onFilterByCompleted={setFilterStatus}
              deleteAllCompleted={deleteAllCompleted}
            />
          </>
        )}
      </div>

      {errorStatus && timerId && (
        <ErrorNotification
          timerId={timerId}
          ErrorMessage={ErrorMessage}
          onErrorStatus={setterErrorStatus}
        />
      )}
    </div>
  );
};

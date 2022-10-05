import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getTodos, updatingData } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/Filter';
import { Todo } from './types/Todo';
import { getFilteredTodo } from './utils/functions';

export const tabs: FilterTypes[] = [
  { id: '', title: 'All' },
  { id: 'active', title: 'Active' },
  { id: 'completed', title: 'Completed' },
];

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [hideError, setHideError] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [toggleAll, setToggleAll] = useState(false);
  const onTabSelected = (tab: FilterTypes) => {
    setSelectedTabId(tab.id);
  };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId) || tabs[0];

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const todosFromServer = await getTodos(user?.id);

          setIsLoading(false);

          setTodos(todosFromServer);
        }
      } catch (errorFromServer) {
        setError(`${errorFromServer}`);
      }
    };

    fetchData();
  }, []);

  const resultTodo = useMemo(() => {
    return getFilteredTodo(todos, selectedTab);
  }, [todos, selectedTab]);

  const handlerClick = (todosFromList: Todo[]) => {
    const fetchData = async () => {
      try {
        const notCompleted = todos.filter(({ completed }) => !completed);
        const completedTodos = todos.filter(({ completed }) => completed);

        if (completedTodos.length === todos.length) {
          setToggleAll(true);
        }

        if (notCompleted.length > 0) {
          setToggleAll(false);
        }

        todosFromList.map(async todo => {
          if (completedTodos.length === todos.length) {
            await updatingData(todo.id, { completed: false });
          } else {
            await updatingData(todo.id, { completed: true });
          }
        });

        setTodos((state) => [...state].map(todo => {
          if (completedTodos.length === todos.length) {
            return ({
              ...todo,
              completed: false,
            });
          }

          return ({
            ...todo,
            completed: true,
          });
        }));
      } catch (errorFromServer) {
        setError('Unable to update a todo');
      }
    };

    fetchData();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            aria-label="ToggleAllButton"
            className={classNames('todoapp__toggle-all',
              {
                active: toggleAll,
              })}
            onClick={() => handlerClick(todos)}
          />

          <NewTodoForm
            newTodoField={newTodoField}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            setError={setError}
            setTodos={setTodos}
            todos={todos}
            setIsLoading={setIsLoading}
            setTempTitle={setTempTitle}
            user={user}
            isLoading={isLoading}
          />
        </header>
        {todos.length > 0
          && (
            <>
              <TodoList
                todos={resultTodo}
                setTodos={setTodos}
                setError={setError}
                isLoading={isLoading}
                selectedTodoId={selectedTodoId}
                setSelectedTodoId={setSelectedTodoId}
                tempTitle={tempTitle}
              />

              <Footer
                tabs={tabs}
                selectedTabId={selectedTabId}
                onTabSelected={onTabSelected}
                todos={todos}
                setTodos={setTodos}
                setError={setError}
              />
            </>
          )}

      </div>

      <ErrorMessage
        error={error}
        setHideError={setHideError}
        hideError={hideError}
        setError={setError}
      />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  createTodo, deleteTodo, getTodos, updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { getVisibleTodos, isAllCompleted } from './helper';
import { Filter } from './types/Filter';
import { NewTodo } from './components/NewTodo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [processingTodosId, setProcessingTodosId] = useState([0]);
  const [isToggleAll, setIsToggleAll] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleChangeCompletedFilter = useCallback((str: Filter) => {
    setCompletedFilter(str);
  }, []);
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  const submitNewTodo = useCallback(async (title: string) => {
    if (!(title.trim())) {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    setIsAdding(true);
    if (user) {
      try {
        const currentTodo = {
          title,
          userId: user?.id,
          completed: false,
          id: 0,
        };

        setTempTodo(currentTodo);

        const newTodo = await createTodo(currentTodo);

        setTodos(prev => [...prev, newTodo]);
      } catch (e) {
        showErrorMessage('Unable to add a todo');
      }
    }

    setIsAdding(false);
    setTempTodo(null);
  }, [user]);

  const handleDeleteTodo = useCallback(async (id: number) => {
    setProcessingTodosId([id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (e) {
      showErrorMessage('Unable to delete a todo');
    }

    setProcessingTodosId([0]);
  }, []);

  const deleteCompleted = useCallback(async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingTodosId(completedTodoId);

    await Promise.all(completedTodoId.map(id => deleteTodo(id)));
    setTodos(prev => prev.filter(todo => !completedTodoId.includes(todo.id)));

    setProcessingTodosId([0]);
  }, [todos]);

  const toggleTodoStatus = useCallback(async (id: number, status: boolean) => {
    setProcessingTodosId([id]);

    try {
      await updateTodos(id, { completed: status });
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: status };
        }

        return todo;
      }));
    } catch (e) {
      showErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodosId([0]);
    }
  }, []);

  const onToggleAll = async () => {
    const completedTodoId = todos
      .filter(todo => todo.completed === isToggleAll)
      .map(todo => todo.id);

    setProcessingTodosId(completedTodoId);

    try {
      await Promise.all(todos.map(todo => (
        updateTodos(todo.id, { completed: !isToggleAll })
      )));

      setTodos(todos.map(todo => ({ ...todo, completed: !isToggleAll })));
      setIsToggleAll(prev => !prev);
    } catch (e) {
      showErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodosId([0]);
    }
  };

  const changeTodoTitle = useCallback(async (id: number, title: string) => {
    setProcessingTodosId([id]);
    try {
      const updatedTodo = await updateTodos(id, { title });

      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return updatedTodo;
        }

        return todo;
      }));
    } catch (e) {
      showErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodosId([0]);
    }
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, completedFilter)
  ), [completedFilter, todos]);

  async function getTodosFromServer() {
    if (user) {
      try {
        const todosFromServer = await getTodos(user?.id);

        setTodos(todosFromServer);
      } catch (e) {
        showErrorMessage('Unable to get a todo');
      }
    }
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setIsToggleAll(isAllCompleted(todos)), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', { active: isToggleAll })}
            onClick={onToggleAll}
          />

          <NewTodo
            newTodoField={newTodoField}
            createTodo={submitNewTodo}
            isAdding={isAdding}
          />
        </header>

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              deletingTodosId={processingTodosId}
              onToggleTodoStatus={toggleTodoStatus}
              changeTodoTitle={changeTodoTitle}
            />

            <Footer
              todosArrayLength={todos.length}
              onCompletedFilterChange={handleChangeCompletedFilter}
              complitedFilter={completedFilter}
              deleteCompleted={deleteCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}

      </div>
    </div>
  );
};

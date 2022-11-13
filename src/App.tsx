import {
  FC, useContext, useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [filterBy, setFilterBy] = useState<TodosFilter>(TodosFilter.None);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const [deleteCompleted, setDeleteCompleted] = useState(false);
  const [isPatchingTodoIds, setIsPatchingTodoIds] = useState<number[]>([]);

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => completed === false)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed === true)
  ), [todos]);

  const handleTodosFilter = useCallback((filter: TodosFilter) => {
    switch (filter) {
      case TodosFilter.Completed:
        setVisibleTodos(completedTodos);
        break;
      case TodosFilter.Active:
        setVisibleTodos(activeTodos);
        break;

      default:
        setVisibleTodos(todos);
    }
  }, [todos]);

  const getAllTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setVisibleTodos(todosFromServer);
      }
    } catch (error) {
      setIsError(true);
    }
  }, []);

  const addTodoToServer = useCallback(async (todoTitle: string) => {
    if (user) {
      try {
        setTempTodo(currTodo => ({
          ...currTodo,
          userId: user.id,
          title: todoTitle,
        }));
        setIsAdding(true);

        await addTodo(user.id, todoTitle);
        await getAllTodos();
      } catch (error) {
        setIsError(true);
        setErrorNotification('Unable to add a todo');
      } finally {
        setIsAdding(false);
      }
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      getAllTodos();
    } catch (error) {
      setIsError(true);
      setErrorNotification('Unable to delete a todo');
    }
  }, []);

  const deleteAllCompleted = useCallback(async () => {
    try {
      setDeleteCompleted(true);
      await Promise.all(completedTodos.map(({ id }) => (
        deleteTodoFromServer(id)
      )));
      await getAllTodos();
    } catch (error) {
      setErrorNotification('Unable to remove all completed todo');
      setIsError(true);
    } finally {
      setDeleteCompleted(false);
    }
  }, [completedTodos]);

  const handleTodoUpdate = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      if (user) {
        try {
          setIsPatchingTodoIds([...isPatchingTodoIds, todoId]);
          await updateTodo(todoId, data);
          await getAllTodos();
        } catch (error) {
          setIsError(true);
          setErrorNotification('Unable to update a todo');
        } finally {
          setIsPatchingTodoIds(isPatchingTodoIds.filter(id => id !== todoId));
        }
      }
    }, [todos],
  );

  const isActiveToggleAll = todos.length === completedTodos.length;

  const handleToggleAll = useCallback(async () => {
    try {
      await Promise.all(todos.map(({ id, completed }) => {
        if (isActiveToggleAll) {
          setIsPatchingTodoIds(currIsPatching => [...currIsPatching, id]);

          return updateTodo(id, { completed: false });
        }

        if (!completed) {
          setIsPatchingTodoIds(currIsPatching => [...currIsPatching, id]);

          return updateTodo(id, { completed: true });
        }

        return null;
      }));

      await getAllTodos();
    } catch (error) {
      setErrorNotification('Unable to update todos');
      setIsError(true);
    } finally {
      setIsPatchingTodoIds([]);
    }
  }, [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getAllTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsError(false), 3000);
  }, [isError]);

  const handleErrorChange = useCallback(() => {
    setIsError(currError => !currError);
  }, []);

  const handleErrorNotification = useCallback((str: string) => {
    setErrorNotification(str);
  }, []);

  const handleFilterChange = (filter: TodosFilter) => {
    handleTodosFilter(filter);
    setFilterBy(filter);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          addTodoToServer={addTodoToServer}
          errorChange={handleErrorChange}
          ErrorNotification={handleErrorNotification}
          isTodos={todos.length}
          isActiveToggleAll={isActiveToggleAll}
          handleToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodoFromServer}
              isAdding={isAdding}
              tempTodo={tempTodo}
              deleteCompleted={deleteCompleted}
              handleTodoUpdate={handleTodoUpdate}
              isPatchingTodoIds={isPatchingTodoIds}
            />

            <Footer
              numberOfActive={activeTodos.length}
              numberOfCompeleted={completedTodos.length}
              handleFilter={handleFilterChange}
              filterBy={filterBy}
              deleteAllCompleted={deleteAllCompleted}
            />
          </>
        )}
      </div>

      {isError && (
        <ErrorMessage
          errorNotification={errorNotification}
          errorChange={handleErrorChange}
        />
      )}
    </div>
  );
};

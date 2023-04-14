import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filterTodosByCompleted } from './HelpersFunctions';
import { Todo } from './types/Todo';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodoCompleted,
  updateTodoTitle,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Loader } from './components/Loader';
import { FilterBy } from './types/FilteredBy';
import { ErrorMessage } from './components/ErrorMessage';
import { USER_ID } from './consts';
import { Footer } from './components/Footer/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';
import { Header } from './components/Header/Header';

export const App: FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessageType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const addLoadingTodo = useCallback((id: number) => {
    setLoadingIds(state => {
      state.add(id);

      return new Set(state);
    });
  }, []);

  const removeLoadingTodo = useCallback((id: number) => {
    setLoadingIds(state => {
      state.delete(id);

      return new Set(state);
    });
  }, []);

  const isTodoLoading = useCallback(
    (id: number) => loadingIds.has(id),
    [loadingIds],
  );

  const activeInput = tempTodo === null;

  const showError = (message: ErrorMessageType) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessageType.NONE);
    }, 3000);
  };

  const loadAllTodos = async () => {
    setIsLoadingTodos(true);
    try {
      const todos = await getTodos(USER_ID);

      setAllTodos(todos);
    } catch {
      showError(ErrorMessageType.LOAD);
    } finally {
      setTempTodo(null);
      setIsLoadingTodos(false);
    }
  };

  const handleRemoveTodo = useCallback(
    async (id: number) => {
      try {
        addLoadingTodo(id);
        await removeTodo(id);

        setAllTodos(prevTodos => prevTodos.filter(todo => (
          todo.id !== id
        )));
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        removeLoadingTodo(id);
      }
    }, [allTodos],
  );

  useEffect(() => {
    loadAllTodos();
  }, []);

  const handleRemoveAllCompletedTodo = useCallback(async () => {
    const completedTodos = allTodos.filter(({ completed }) => completed);

    completedTodos.forEach(async todo => {
      try {
        addLoadingTodo(todo.id);
        await removeTodo(todo.id);

        setAllTodos(prevTodos => prevTodos.filter(({ completed }) => (
          !completed
        )));
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        setLoadingIds(new Set());
      }
    });
  }, [allTodos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(allTodos, filterType);
  }, [allTodos, filterType]);

  const countActiveTodos = useMemo(() => (
    filterTodosByCompleted(
      allTodos,
      FilterBy.ACTIVE,
    )
  ), [allTodos, filterType]).length;

  const isCompletedTodo = allTodos.length - countActiveTodos > 0;
  const hasActiveTodo = countActiveTodos > 0;

  const handleAddNewTodo = useCallback(
    async () => {
      if (!todoTitle.trim()) {
        showError(ErrorMessageType.EMPTY_TITLE);

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });
      try {
        const addedTodo = await addTodo(newTodo);

        setAllTodos(todos => [...todos, addedTodo]);
      } catch {
        showError(ErrorMessageType.ADD);
      } finally {
        setTodoTitle('');
        setTempTodo(null);
      }
    }, [todoTitle],
  );

  const handleUpdateTodoCompleted = useCallback(
    async (todoId: number) => {
      try {
        const findTodo = allTodos.find(todo => todo.id === todoId);

        addLoadingTodo(todoId);
        await updateTodoCompleted(todoId, !findTodo?.completed);

        setAllTodos(prevTodos => (
          prevTodos.map(todo => {
            if (findTodo?.id === todo.id) {
              findTodo.completed = !findTodo.completed;

              return findTodo;
            }

            return todo;
          })
        ));
      } catch {
        setErrorMessage(ErrorMessageType.UPDATE);
      } finally {
        removeLoadingTodo(todoId);
      }
    }, [allTodos],
  );

  const handleChangeStatusAllTodos = useCallback(
    async () => {
      try {
        const allTodosPromises = allTodos.map(async (todo) => {
          if (hasActiveTodo) {
            if (!todo.completed) {
              addLoadingTodo(todo.id);
            }
          } else if (todo.completed) {
            addLoadingTodo(todo.id);
          }

          return updateTodoCompleted(todo.id, hasActiveTodo);
        });
        const updatedTodos = await Promise.all(allTodosPromises);

        setAllTodos(updatedTodos);
      } catch {
        showError(ErrorMessageType.UPDATE);
      } finally {
        setLoadingIds(new Set());
      }
    }, [allTodos],
  );

  const changeTitleByDoubleClick = useCallback(
    async (todoId: number, newTitle: string) => {
      if (!newTitle.length) {
        await handleRemoveTodo(todoId);

        return;
      }

      try {
        addLoadingTodo(todoId);

        await updateTodoTitle(todoId, newTitle);

        setAllTodos(prevTodos => (
          prevTodos.map((todo) => {
            if (todoId === todo.id) {
              const updatedTodo = { ...todo };

              updatedTodo.title = newTitle;

              return updatedTodo;
            }

            return todo;
          })
        ));
      } catch {
        showError(ErrorMessageType.UPDATE);
      } finally {
        removeLoadingTodo(todoId);
      }
    }, [allTodos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeInput={activeInput}
          handleAddNewTodo={handleAddNewTodo}
          handleChangeStatusAllTodos={handleChangeStatusAllTodos}
          hasActiveTodo={hasActiveTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />

        {isLoadingTodos
          ? (
            <Loader />
          ) : (
            <section className="todoapp__main">
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                handleRemoveTodo={handleRemoveTodo}
                isTodoLoading={isTodoLoading}
                handleUpdateTodoCompleted={handleUpdateTodoCompleted}
                changeTitleByDoubleClick={changeTitleByDoubleClick}
              />
            </section>
          )}

        {allTodos.length !== 0 && (
          <Footer
            countActiveTodos={countActiveTodos}
            isCompletedTodo={isCompletedTodo}
            handleRemoveAllCompletedTodo={handleRemoveAllCompletedTodo}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

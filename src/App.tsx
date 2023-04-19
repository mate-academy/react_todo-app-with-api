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
import { Footer } from './components/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';
import { Header } from './components/Header';

export const App: FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessageType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const setTodoLoading = useCallback((id: number) => {
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

  const getIsTodoLoading = useCallback(
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
      setIsLoadingTodos(false);
    }
  };

  const handleRemoveTodo = useCallback(
    async (id: number) => {
      try {
        setTodoLoading(id);
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

  const handleRemoveAllCompletedTodo = useCallback(() => {
    const completedTodos = allTodos.filter(({ completed }) => completed);

    completedTodos.forEach(todo => {
      handleRemoveTodo(todo.id);
    });
  }, [allTodos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(allTodos, filterType);
  }, [allTodos, filterType]);

  const activeTodos = useMemo(() => (
    filterTodosByCompleted(
      allTodos,
      FilterBy.ACTIVE,
    )
  ), [allTodos, filterType]);

  const countActiveTodos = activeTodos.length;
  const hasCompletedTodo = allTodos.length - countActiveTodos > 0;
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

  const handleChangeTodoStatus = useCallback(
    async (todoId: number) => {
      try {
        setTodoLoading(todoId);

        setAllTodos(prevTodos => {
          const foundTodo = prevTodos.find(todo => todo.id === todoId);

          updateTodoCompleted(todoId, !foundTodo?.completed);

          return (
            prevTodos.map(todo => {
              if (foundTodo?.id === todo.id) {
                foundTodo.completed = !foundTodo.completed;

                return foundTodo;
              }

              return todo;
            })
          );
        });
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
          if (hasActiveTodo && !todo.completed) {
            setTodoLoading(todo.id);
          }

          if (!hasActiveTodo && todo.completed) {
            setTodoLoading(todo.id);
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

  const changeTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      if (!newTitle.length) {
        await handleRemoveTodo(todoId);

        return;
      }

      try {
        setTodoLoading(todoId);

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
                getIsTodoLoading={getIsTodoLoading}
                handleChangeTodoStatus={handleChangeTodoStatus}
                changeTitle={changeTitle}
              />
            </section>
          )}

        {allTodos.length !== 0 && (
          <Footer
            countActiveTodos={countActiveTodos}
            hasCompletedTodo={hasCompletedTodo}
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

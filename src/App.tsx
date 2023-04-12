import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
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
import { Form } from './components/Form';
import { ErrorMessage } from './components/ErrorMessage';
import { USER_ID } from './consts';
import { Footer } from './components/Footer/Footer';
import { ErrorMessageType } from './types/ErrorMessageType';

export const App: FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessageType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState<FilterBy>(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeInput, setActiveInput] = useState(true);
  const [isRequest, setIsRequest] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const showError = (message: ErrorMessageType) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessageType.NONE);
    }, 3000);
  };

  const loadAllTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setAllTodos(todos);
      setIsRequest(true);
    } catch {
      showError(ErrorMessageType.LOAD);
    } finally {
      setTempTodo(null);
      setActiveInput(true);
    }
  };

  const handleRemoveTodo = useCallback(
    async (id: number) => {
      try {
        setLoadingTodoIds(prev => [...prev, id]);
        await removeTodo(id)
          .then(() => {
            const todosWithoutDeleted = allTodos.filter((todo) => (
              todo.id !== id
            ));

            setAllTodos(todosWithoutDeleted);
          });
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        setLoadingTodoIds([]);
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
        setLoadingTodoIds(prev => [...prev, todo.id]);
        await removeTodo(todo.id)
          .then(() => {
            const todosWithoutDeleted = allTodos.filter(({ completed }) => (
              !completed
            ));

            setAllTodos(todosWithoutDeleted);
          });
      } catch {
        setErrorMessage(ErrorMessageType.DELETE);
      } finally {
        setLoadingTodoIds([]);
      }
    });
  }, [allTodos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(allTodos, filterType);
  }, [allTodos, filterType]);

  const countActiveTodos = filterTodosByCompleted(
    allTodos,
    FilterBy.ACTIVE,
  ).length;

  const isCompletedTodo = allTodos.length - countActiveTodos > 0;
  const hasActiveTodo = countActiveTodos > 0;

  const handleAddNewTodo = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
      setActiveInput(false);

      addTodo(newTodo)
        .then(todo => {
          setAllTodos(todos => [...todos, todo]);
        })
        .catch(() => showError(ErrorMessageType.ADD))
        .finally(() => {
          setActiveInput(true);
          setTodoTitle('');
          setTempTodo(null);
        });
    }, [todoTitle],
  );

  const handleUpdateTodoCompleted = useCallback(
    async (todoId: number) => {
      try {
        const findTodo = allTodos.find(todo => todo.id === todoId);

        await setLoadingTodoIds(prev => [...prev, todoId]);
        await updateTodoCompleted(todoId, !findTodo?.completed);

        const newTodos = allTodos.map(todo => {
          if (findTodo?.id === todo.id) {
            findTodo.completed = !findTodo.completed;

            return findTodo;
          }

          return todo;
        });

        setAllTodos(newTodos);
      } catch {
        setErrorMessage(ErrorMessageType.UPDATE);
      } finally {
        setLoadingTodoIds([]);
      }
    }, [allTodos],
  );

  const handleChangeStatusAllTodos = useCallback(
    async () => {
      const allTodosPromises = allTodos.map(async (todo) => {
        if (hasActiveTodo) {
          if (!todo.completed) {
            await setLoadingTodoIds(prev => [...prev, todo.id]);
          }
        } else if (todo.completed) {
          await setLoadingTodoIds(prev => [...prev, todo.id]);
        }

        return updateTodoCompleted(todo.id, hasActiveTodo);
      });

      try {
        const updatedTodos = await Promise.all(allTodosPromises);

        setAllTodos(updatedTodos);
      } catch {
        showError(ErrorMessageType.UPDATE);
      } finally {
        setLoadingTodoIds([]);
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
        await setLoadingTodoIds(prev => [...prev, todoId]);

        await updateTodoTitle(todoId, newTitle);
        const newTodos = allTodos.map((todo) => {
          if (todoId === todo.id) {
            const updatedTodo = { ...todo };

            updatedTodo.title = newTitle;

            return updatedTodo;
          }

          return todo;
        });

        setAllTodos(newTodos);
      } catch {
        showError(ErrorMessageType.UPDATE);
      } finally {
        setLoadingTodoIds([]);
      }
    }, [allTodos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="clear"
            type="button"
            onClick={handleChangeStatusAllTodos}
            className={classNames(
              'todoapp__toggle-all',
              {
                active: hasActiveTodo,
              },
            )}
          />

          <Form
            handleAddTodo={handleAddNewTodo}
            todoTitle={todoTitle}
            setTodoTitle={setTodoTitle}
            activeInput={activeInput}
          />
        </header>

        {(!allTodos.length && isRequest && !errorMessage)
        && (
          <span style={{
            display: 'flex',
            justifyContent: 'center',
            color: 'grey',
          }}
          >
            You have not any todos
          </span>
        )}

        {!allTodos.length && !errorMessage && !isRequest
          ? (
            <Loader />
          ) : (
            <section className="todoapp__main">
              <TodoList
                todos={visibleTodos}
                tempTodos={tempTodo}
                handleRemoveTodo={handleRemoveTodo}
                loadingTodoIds={loadingTodoIds}
                handleUpdateTodoCompleted={handleUpdateTodoCompleted}
                changeTitleByDoubleClick={changeTitleByDoubleClick}
              />
            </section>
          )}

        {!allTodos.length || (
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

/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  USER_ID as id,
  getTodos,
  postTodo,
  patchTodo,
} from './api/todos';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import TodoList from './Components/TodoList/TodoList';
import Notification from './Components/Notification/Notification';
import Loader from './Components/Loader/Loader';
import { Todo } from './types/Todo';
import { Error, ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterType';
import { filterTodoList, getMountCompletedTodos } from './utils/filterTodoList';
import { completedTodoPromise, deleteTodoPromise } from './utils/API';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>({
    status: false,
    message: ErrorMessage.NONE,
  });
  const [isLoader, setIsLoader] = useState(false);
  const [filterTodosBy, setFilterTodos] = useState(FilterType.All);

  const [isDisabledAddingForm, setIsDisabledAddingForm] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadTodosId, setLoadTodosId] = useState<number[] | null>(null);

  const [
    patchToggleLoader,
    setPatchToggleLoader,
  ] = useState<null | number>(null);

  const visibleTodoList = useMemo(() => (
    filterTodoList(todos, filterTodosBy)
  ), [todos, filterTodosBy]);

  const amountCompletedTodosMemo: number = useMemo(() => (
    getMountCompletedTodos(todos)
  ), [todos]);

  const fetchTodos = async () => {
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    setIsLoader(true);

    try {
      const todosFromServer = await getTodos(id);

      setTodos(todosFromServer);

      if (!todosFromServer.length) {
        setError({
          status: true,
          message: ErrorMessage.LOAD,
        });
      }
    } catch {
      setError({
        status: true,
        message: ErrorMessage.LOAD,
      });
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addNewTodo = async (todo: string) => {
    setIsDisabledAddingForm(true);
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    setIsAddingTodo(true);

    setTempTodo({
      id: Date.now(),
      userId: id,
      title: todo,
      completed: false,
    });

    try {
      const post = await postTodo(id, {
        title: todo,
        userId: id,
        completed: false,
      });
      const prevTodos = [...todos, post];

      setTodos(prevTodos);
    } catch {
      setError({
        status: true,
        message: ErrorMessage.ADD,
      });
    } finally {
      setIsDisabledAddingForm(false);
      setIsAddingTodo(false);
      setTempTodo(null);
    }
  };

  const deleteArrayTodos = (deleteTodos: number[]) => {
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    const arrayPromises: Promise<unknown>[] = [];

    setLoadTodosId(deleteTodos);
    deleteTodos.forEach(idDell => {
      arrayPromises.push(deleteTodoPromise(id, idDell));
    });

    Promise.all(arrayPromises)
      .then(idWilDeletedTodos => {
        const filteredTodos = todos.filter(todo => {
          return !idWilDeletedTodos.includes(todo.id);
        });

        setTodos(filteredTodos);
      })
      .catch(() => setError({
        status: true,
        message: ErrorMessage.DELETE,
      }))
      .finally(() => setLoadTodosId(null));
  };

  const deleteTodoFromList = async (idTodo: number) => {
    deleteArrayTodos([idTodo]);
  };

  const deleteAllCompletedTodos = () => {
    const deleteTodos = todos
      .filter(({ completed }) => completed)
      .map(todo => todo.id);

    deleteArrayTodos(deleteTodos);
  };

  const toggleCompletedTodo = async (
    idTodo: number,
    change: boolean | string,
  ) => {
    setPatchToggleLoader(idTodo);
    setError({
      status: false,
      message: ErrorMessage.NONE,
    });
    try {
      let changeTodo: null | {
        completed?: boolean,
        title?: string,
      } = null;

      if (typeof change === 'boolean') {
        changeTodo = { completed: !change };
      }

      if (typeof change === 'string') {
        changeTodo = { title: change };
      }

      await patchTodo(idTodo, changeTodo);

      setTodos(todos.map(todo => {
        if (!changeTodo) {
          return todo;
        }

        if (idTodo === todo.id) {
          return { ...todo, ...changeTodo };
        }

        return todo;
      }));
    } catch {
      setError({
        status: true,
        message: ErrorMessage.UPDATE,
      });
    } finally {
      setPatchToggleLoader(null);
    }
  };

  const completedAllTodo = () => {
    let todosNotCompleted = todos
      .filter(todo => !todo.completed);

    if (todosNotCompleted.length === 0) {
      todosNotCompleted = todos;
    }

    const todosIdNotCompleted = todosNotCompleted.map(todo => todo.id);
    const completedPromises: Promise<unknown>[] = [];

    setLoadTodosId(todosIdNotCompleted);
    todosNotCompleted.forEach(idCompl => {
      completedPromises
        .push(completedTodoPromise(idCompl.id, idCompl.completed));
    });

    Promise.all(completedPromises)
      .then((resp) => {
        const bool = resp.includes(false);
        const allTodosCompleted = todos.map(todo => {
          return { ...todo, completed: !bool };
        });

        setTodos(allTodosCompleted);
      })
      .catch(() => setError({
        status: true,
        message: ErrorMessage.UPDATE,
      }))
      .finally(() => setLoadTodosId(null));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onEmptyForm={setError}
          isDisabled={isDisabledAddingForm}
          onAdd={addNewTodo}
          statusPost={isAddingTodo}
          completedAll={completedAllTodo}
        />

        {isLoader ? (
          <Loader />
        ) : (
          <TodoList
            todos={visibleTodoList}
            addTodo={tempTodo}
            isAdd={isAddingTodo}
            deleteTodosId={loadTodosId}
            patchToggleLoader={patchToggleLoader}
            onDelete={deleteTodoFromList}
            toggleCompletedTodo={toggleCompletedTodo}
          />
        )}

        {!todos.length || (
          <Footer
            amountCompletedTodos={amountCompletedTodosMemo}
            todosLength={todos.length}
            filterType={filterTodosBy}
            setFilterType={setFilterTodos}
            onClear={deleteAllCompletedTodos}
          />
        )}
      </div>

      {error.status && (
        <Notification
          errorMessage={error.message}
          closeError={setError}
        />
      )}
    </div>
  );
};

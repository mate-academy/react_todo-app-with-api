import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  createTodos,
  deleteTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoLIst } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [hiddenErrorTable, setHiddenErrorTable] = useState(true);
  const [isAdding, setIsAdding] = useState<Todo | null>(null);
  const [clearLoader, setClearLoader] = useState(false);
  const [loadingAllTodos, setLoadingAllTodos] = useState(false);
  const [loadTodo, setLoadTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType>(ErrorType.noError);

  const handleHidden = useCallback(
    (value: boolean) => {
      setHiddenErrorTable(value);
    }, [],
  );

  const setComplitedTodo = async (todo: Todo) => {
    await updateTodo(todo, { completed: true });
  };

  const setUnComplitedTodo = async (todo: Todo) => {
    await updateTodo(todo, { completed: false });
  };

  const handleLoadTodo = useCallback((value: Todo | null) => {
    setLoadTodo(value);
  }, []);

  const handleTypeFilter = useCallback((type: string) => {
    setTypeFilter(type);
  }, []);

  const hanldeUpdateError = useCallback((value: ErrorType) => {
    setError(value);
  }, []);

  const handlerRemoveError = useCallback((value: ErrorType) => {
    setError(value);
  }, []);

  const handlerNewTitle = useCallback((value: string) => {
    setNewTodoTitle(value);
  }, []);

  const getUpdateTodoList = useCallback((uSer:User) => {
    getTodos(uSer.id).then(response => {
      setTodoList(response);
      setIsAdding(null);
      setClearLoader(false);
      setLoadTodo(null);
      setLoadingAllTodos(false);
    });
  }, [user]);

  const createTodo = useCallback(
    async (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newTodoTitle.trim()) {
        setError(ErrorType.errorEmptyTitile);
        setHiddenErrorTable(false);

        return;
      }

      if (user) {
        const newTodo = {
          userId: user.id,
          title: newTodoTitle,
          completed: false,
        };

        setIsAdding(newTodo);

        try {
          await createTodos(newTodo);
        } catch {
          setError(ErrorType.errorAdd);
          setHiddenErrorTable(false);
        }

        getUpdateTodoList(user);
        setNewTodoTitle('');
      }
    }, [newTodoTitle],
  );

  const checkedAllCompletedTodo = (list: Todo[]) => (
    list.every(todo => todo.completed)
  );

  const selectComplited = useCallback(async (todo:Todo) => {
    try {
      setLoadTodo(todo);
      if (todo.completed) {
        await setUnComplitedTodo(todo);
      } else {
        await setComplitedTodo(todo);
      }
    } catch {
      setError(ErrorType.errorUpdate);
      setHiddenErrorTable(false);
      setLoadTodo(null);
    }

    if (user) {
      getUpdateTodoList(user);
    }
  }, [todoList]);

  const selectAllTodos = useCallback(() => {
    setLoadingAllTodos(true);
    todoList.map(async (todo) => {
      if (!checkedAllCompletedTodo(todoList)) {
        if (!todo.completed) {
          selectComplited(todo);
        }
      } else {
        selectComplited(todo);
      }
    });
  }, [todoList]);

  const clearCompletedTodo = useCallback(() => {
    todoList.map(async (todo) => {
      if (todo.completed) {
        try {
          setClearLoader(true);
          await deleteTodos(todo);
        } catch {
          setError(ErrorType.errorRemove);
          setHiddenErrorTable(false);
          setClearLoader(false);
        }

        if (user) {
          getUpdateTodoList(user);
        }
      }
    });
  }, [todoList]);

  useEffect(() => {
    if (user) {
      getUpdateTodoList(user);
    }
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filtrationList = (list:Todo[]) => (
    list.filter(todo => {
      switch (typeFilter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
        default:
          return todo;
      }
    }));

  const filtredList = useMemo(() => filtrationList(todoList),
    [typeFilter, todoList]);

  const handlerCloseErrors = useCallback(() => {
    setHiddenErrorTable(true);
    setError(ErrorType.noError);
  }, [hiddenErrorTable]);

  useEffect(() => {
    setTimeout(handlerCloseErrors, 3000);
  }, [hiddenErrorTable]);

  const countingActiveTodo = (list: Todo[]) => (
    list.filter(todo => !todo.completed).length
  );

  const checkedComplitedTodo = (list: Todo[]) => (
    list.some(todo => todo.completed)
  );

  const selectErrors = () => {
    switch (error) {
      case ErrorType.errorEmptyTitile:
        return 'Title can\'t be empty';
      case ErrorType.errorAdd:
        return 'Unable to add a todo';
      case ErrorType.errorUpdate:
        return 'Unable to update a todo';
      case ErrorType.errorRemove:
        return 'Unable to delete a todo';
      default:
        return null;
    }
  };

  const hasComplitedTodo = useMemo(() => checkedComplitedTodo(todoList),
    [todoList]);
  const counterActiveTodos = useMemo(() => countingActiveTodo(todoList),
    [todoList]);
  const allComplited = useMemo(() => checkedAllCompletedTodo(todoList)
  && !!todoList.length,
  [todoList]);

  const errorMessage = useMemo(
    () => selectErrors(),
    [error],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          allComplited={allComplited}
          selectAllTodos={selectAllTodos}
          createTodo={createTodo}
          newTodoTitle={newTodoTitle}
          onNewTodoTitle={handlerNewTitle}
        />

        <TodoLIst
          List={filtredList}
          onErrorRemove={handlerRemoveError}
          onErrorUpdate={hanldeUpdateError}
          onHidden={handleHidden}
          updateTodoList={getUpdateTodoList}
          isAdding={isAdding}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onLoadTodo={handleLoadTodo}
          loadTodo={loadTodo}
        />

        {!!todoList.length && (
          <Footer
            counterActiveTodos={counterActiveTodos}
            typeFilter={typeFilter}
            onTypeFilter={handleTypeFilter}
            hasComplitedTodo={hasComplitedTodo}
            clearCompletedTodo={clearCompletedTodo}
          />
        )}
      </div>

      <Error
        hidden={hiddenErrorTable}
        onCloseErrors={handlerCloseErrors}
        errorMessage={errorMessage}
      />
    </div>
  );
};

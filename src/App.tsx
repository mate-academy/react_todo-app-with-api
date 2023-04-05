import './App.scss';
import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  postTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from './api/todos';
import { Notification } from './components/Notification';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import {
  CountPerStatus,
  getCountPerStatus,
  getVisibleTodos,
} from './utils/functions';
import { FilteringMethod } from './types/FilteringStatus';

const USER_ID = 6648;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterMethod, setFilterStatus] = useState(FilteringMethod.ALL);
  const [loadingTodosIDs, setLoadingTodosIDs] = useState<number[]>([]); // problem is here
  const [textFieldValue, setTextFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  useEffect(() => {
    (async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setErrorMessage(ErrorMessage.LOAD);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      }
    })();
  }, []);

  const showErrorMessage = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessage.NONE);
    }, 3000);
  }, []);

  const setTodoLoading = useCallback((id: number) => {
    setLoadingTodosIDs(prevState => [...prevState, id]);
  }, []);

  const unsetTodoLoading = useCallback((id: number) => {
    setLoadingTodosIDs(prevState => prevState.filter(num => num !== id));
  }, []);

  const addTodo = useCallback(async () => {
    setIsInputDisabled(true);

    const newTodo = {
      title: textFieldValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const resultingTodo = await postTodo(newTodo);

      setTodos(prev => [
        ...prev,
        resultingTodo,
      ]);
      setTextFieldValue('');
    } catch {
      showErrorMessage(ErrorMessage.ADD);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  }, [textFieldValue]);

  const deleteTodo = useCallback(async (id: number) => {
    setTodoLoading(id);

    try {
      await removeTodo(id);

      const newTodosList = todos.filter(todo => todo.id !== id);

      setTodos(() => newTodosList);
    } catch {
      showErrorMessage(ErrorMessage.DELETE);
    } finally {
      unsetTodoLoading(id);
    }
  }, [todos]);

  const deleteAllCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setTodoLoading(todo.id);
    });

    try {
      await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));

      const uncompletedTodos = todos.filter(todo => !todo.completed);

      setTodos(uncompletedTodos);
    } catch {
      showErrorMessage(ErrorMessage.DELETE);
    } finally {
      setLoadingTodosIDs([]);
    }
  }, [todos]);

  const updateTodo = useCallback(async (id: number, data: object) => {
    setTodoLoading(id);

    try {
      const updatedTodo = await patchTodo(id, data);

      setTodos(prev => prev.map(todo => {
        return todo.id === id
          ? updatedTodo
          : todo;
      }));
    } catch {
      showErrorMessage(ErrorMessage.UPDATE);
    } finally {
      unsetTodoLoading(id);
    }
  }, []);

  const updateAll = useCallback(async () => {
    const isAllDone = todos.every(todo => todo.completed);
    const newStatus = { completed: !isAllDone };

    const todosToUpdate = todos.filter(todo => (
      todo.completed !== newStatus.completed));

    await Promise.all(todosToUpdate.map((todo) => (
      updateTodo(todo.id, newStatus))));
  }, [todos]);

  const handleTextFieldValue = useCallback((value: string) => {
    setTextFieldValue(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!textFieldValue) {
      showErrorMessage(ErrorMessage.EMPTY_TITLE);
    } else {
      addTodo();
    }
  }, [textFieldValue]);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filterMethod);
  }, [todos, filterMethod]);

  const countPerStatus: CountPerStatus = useMemo(() => {
    return getCountPerStatus(todos);
  }, [todos]);

  return (
    <div className="App">
      <h1 className="App__title">todos</h1>

      <div className="App__content">
        <Header
          onSubmit={handleSubmit}
          textFieldValue={textFieldValue}
          handleTextFieldValue={handleTextFieldValue}
          isDisabled={isInputDisabled}
          onUpdateAll={updateAll}
          isButtonActive={countPerStatus.completed === todos.length}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          loadingTodosIDs={loadingTodosIDs}
          onUpdate={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterStatus={filterMethod}
            onStatusChange={setFilterStatus}
            countPerStatus={countPerStatus}
            onClearAll={deleteAllCompleted}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.NONE)}
      />

    </div>
  );
};

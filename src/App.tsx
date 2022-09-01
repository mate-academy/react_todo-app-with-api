/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './components/Auth/AuthContext';
import { deleteTodo, getTodos, updateTodoById } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { HeaderTodo } from './components/HeaderTodo';
import { FooterTodo } from './components/FooterTodo';
import { ErrorNotification } from './components/ErrorNotification';

export const App = () => {
  const user = useContext(AuthContext);
  const { filteredBy } = useParams();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changedTodosId, setChangedTodosId] = useState<number[]>([]);

  // ** Error handler ** //
  const onError = useCallback((errorTitle: string) => {
    setErrorMessage(errorTitle);
  }, []);

  // ** set timer for auto deleting error message **//
  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  // ** Array length only with active todo, created for counter active todo in footer ** //
  const lengthActive = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  // ** Array length only with completed todo, created for showing clear button ** //
  const lengthCompleted = useMemo(
    () => todos.length - lengthActive,
    [todos, lengthActive],
  );

  // ** request to the server to get all todos ** //
  useEffect(() => {
    if (user) {
      setErrorMessage('');
      getTodos(user.id).then(res => {
        setTodos(res);
      }).catch(onError).finally(() => {
        setShouldUpdate(false);
        setChangedTodosId([]);
      });
    }
  }, [user, shouldUpdate]);

  // ** filtering todo when click on button in footer ** //
  const filteredTodos = useMemo(() => {
    switch (filteredBy) {
      case FilterType.active:
        return todos.filter(todo => !todo.completed);

      case FilterType.completed:
        return todos.filter(todo => todo.completed);

      case FilterType.all:
      default:
        return [...todos];
    }
  }, [filteredBy, todos]);

  // ** deleting todo by id ** //
  const removeTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);
    deleteTodo(todoId)
      .then(res => {
        if (res) {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        }
      })
      .catch(() => onError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  }, []);

  // ** updating todo field like completed or title by id ** //
  const updateTodo = useCallback((todoId:number, data: {}) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);
    updateTodoById(todoId, data)
      .then(res => setTodos(prev => prev.map(todo => {
        if (todo.id === res.id) {
          return res;
        }

        return todo;
      })))
      .catch(() => onError('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          loading={isLoading}
          lengthCompleted={lengthCompleted}
          setTodos={setTodos}
          onLoading={setIsLoading}
          onError={onError}
          onSelected={setSelectedTodoId}
          onChanged={setChangedTodosId}
        />

        <TodoList
          todos={filteredTodos}
          selectedTodoId={selectedTodoId}
          onDeleteTodo={removeTodo}
          onUpdateTodo={updateTodo}
          loading={isLoading}
          changedTodosId={changedTodosId}
          errorMessage={errorMessage}
        />

        {todos.length > 0 && (
          <FooterTodo
            todos={todos}
            lengthActive={lengthActive}
            lengthCompleted={lengthCompleted}
            setTodos={setTodos}
            onLoading={setIsLoading}
            onError={onError}
            onSelected={setSelectedTodoId}
            onChanged={setChangedTodosId}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification errorMessage={errorMessage} onError={onError} />
      )}
    </div>
  );
};

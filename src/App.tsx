/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { filteredTodosFunction } from './components/Helpers/FilteredTodos';
import { TodoInfo } from './components/TodoInfo/TodoInfo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoAdding, setIsTodoAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage(ErrorMessage.DownloadError);
        });
    }
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const comletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const filteredTodos = useMemo(() => (
    filteredTodosFunction(todos, status)
  ), [todos, status]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage(ErrorMessage.EmptyTitle);

        return;
      }

      const createNewTodo = async () => {
        setIsTodoAdding(true);

        if (user) {
          try {
            setTempTodo({
              id: 0,
              userId: user.id,
              title,
              completed: false,
            });

            const newTodo = await addTodo({
              userId: user.id,
              title,
              completed: false,
            });

            setTitle('');

            setTodos(prevTodos => [...prevTodos, newTodo]);
          } catch (error) {
            setErrorMessage(ErrorMessage.AddTodoError);
          } finally {
            setIsTodoAdding(false);
            setTempTodo(null);
          }
        }
      };

      createNewTodo();
    }, [title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setSelectedTodoIds([todoId]);

      await deleteTodo(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoId)
      ));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  const clearTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const changeTodo = useCallback(async (
    id: number,
    itemsToUpdate: Partial<Todo>,
  ) => {
    try {
      setSelectedTodoIds(prevTodoIds => [...prevTodoIds, id]);

      await updateTodo(id, itemsToUpdate);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === id
          ? { ...todo, ...itemsToUpdate }
          : todo
      )));
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  const toggleTodo = useCallback(async (
    id: number,
    statusTodo: boolean,
  ) => {
    setSelectedTodoIds([id]);

    try {
      await updateTodo(id, { completed: statusTodo });
      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === id
          ? { ...todo, completed: statusTodo }
          : todo
      )));
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  const toggleAllTodos = useCallback(async () => {
    const todoIdstoUpdate = todos
      .filter(todo => todo.completed === isAllTodosCompleted)
      .map(todo => todo.id);

    setSelectedTodoIds(todoIdstoUpdate);

    try {
      await Promise.all(todos.map(todo => (
        updateTodo(todo.id, { completed: !isAllTodosCompleted })
      )));

      setTodos(todos.map(todo => (
        { ...todo, completed: !isAllTodosCompleted }
      )));
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          isTodoAdding={isTodoAdding}
          newTodoField={newTodoField}
          handleSubmit={handleSubmit}
          isAllTodosCompleted={isAllTodosCompleted}
          toggleAllTodos={toggleAllTodos}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              newTodoField={newTodoField}
              todos={filteredTodos}
              toggleTodo={toggleTodo}
              selectedTodoIds={selectedTodoIds}
              removeTodo={removeTodo}
              changeTodo={changeTodo}
            />
            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                isTodoAdding={isTodoAdding}
                removeTodo={removeTodo}
                changeTodo={changeTodo}
                newTodoField={newTodoField}
                toggleTodo={toggleTodo}
                selectedTodoIds={selectedTodoIds}
              />
            )}
            <Footer
              activeTodos={activeTodos}
              comletedTodos={comletedTodos}
              status={status}
              setStatus={setStatus}
              clearTodos={clearTodos}
            />
          </>
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

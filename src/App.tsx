/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import {
  addTodo, deleteTodo, editTodo, getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const activeTodosQuantity = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isAnyTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const isEachTodoCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        case FilterStatus.All:
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorMessage.UnableToLoad));
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage(ErrorMessage.TitleCantBeEmpty);

        return;
      }

      const addNewTodo = async () => {
        setIsAdding(true);

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

            setTodos(currentTodos => [...currentTodos, newTodo]);
          } catch (error) {
            setErrorMessage(ErrorMessage.UnableToAdd);
          } finally {
            setIsAdding(false);
            setTempTodo(null);
          }
        }
      };

      addNewTodo();
    }, [title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setSelectedTodoIds([todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToDelete);
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  const clearAllCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const toggleTodoStatus
    = useCallback(async (todoId: number, status: boolean) => {
      setSelectedTodoIds([todoId]);

      try {
        await editTodo(todoId, { completed: status });
        setTodos(prevTodos => prevTodos.map(todo => (
          todo.id === todoId
            ? { ...todo, completed: status }
            : todo
        )));
      } catch {
        setErrorMessage(ErrorMessage.UnableToUpdate);
      } finally {
        setSelectedTodoIds([]);
      }
    }, []);

  const toggleAllTodosStatus
    = useCallback(async () => {
      const todoIdsNeededToUpdate = todos
        .filter(todo => todo.completed === isEachTodoCompleted)
        .map(todo => todo.id);

      setSelectedTodoIds(todoIdsNeededToUpdate);

      try {
        await Promise.all(todos.map(todo => (
          editTodo(todo.id, { completed: !isEachTodoCompleted })
        )));

        setTodos(todos.map(todo => (
          { ...todo, completed: !isEachTodoCompleted }
        )));
      } catch {
        setErrorMessage(ErrorMessage.UnableToUpdate);
      } finally {
        setSelectedTodoIds([]);
      }
    }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    try {
      setSelectedTodoIds(prevTododIds => [
        ...prevTododIds,
        todoId,
      ]);

      await editTodo(todoId, fieldsToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...fieldsToUpdate }
          : todo
      )));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdate);
    } finally {
      setSelectedTodoIds([]);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={isAdding}
          onChange={setTitle}
          onSubmit={handleSubmit}
          newTodoField={newTodoField}
          isEachTodoCompleted={isEachTodoCompleted}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              selectedTodoIds={selectedTodoIds}
              removeTodo={removeTodo}
              toggleTodoStatus={toggleTodoStatus}
              newTodoField={newTodoField}
              updateTodo={updateTodo}
            />

            {tempTodo
              && (
                <TodoItem
                  todo={tempTodo}
                  isAdding={isAdding}
                  removeTodo={removeTodo}
                  updateTodo={updateTodo}
                  newTodoField={newTodoField}
                  toggleTodoStatus={toggleTodoStatus}
                  selectedTodoIds={selectedTodoIds}
                />
              )}

            <Footer
              filterStatus={filterStatus}
              isAnyTodoCompleted={isAnyTodoCompleted}
              activeTodosQuantity={activeTodosQuantity}
              clearAllCompletedTodos={clearAllCompletedTodos}
              setFilterStatus={setFilterStatus}
            />
          </>
        )}

      </div>

      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

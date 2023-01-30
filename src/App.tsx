/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/Error/Error';
import {
  getTodos,
  addTodo,
  deleteTodo,
  editTodo,
} from './api/todos';
import { FilterType } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const isEveryTodoCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage('Something went wrong'));
    }
  }, []);

  const handleSubmitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorMessage('Title can\'t be empty');

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
            setErrorMessage('Unable to add a todo');
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
      setSelectedTodoId([todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setSelectedTodoId([]);
    }
  }, []);

  const cleanCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    try {
      setSelectedTodoId(prevTododIds => [
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
      setErrorMessage('Unable to update a todo');
    } finally {
      setSelectedTodoId([]);
    }
  }, []);

  const switchTodo
    = useCallback(async (todoId: number, status: boolean) => {
      setSelectedTodoId([todoId]);

      try {
        await editTodo(todoId, { completed: status });
        setTodos(prevTodos => prevTodos.map(todo => (
          todo.id === todoId
            ? { ...todo, completed: status }
            : todo
        )));
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setSelectedTodoId([]);
      }
    }, []);

  const switchAllTodos = useCallback(async () => {
    const todoToUpdate = todos
      .filter(todo => todo.completed === isEveryTodoCompleted)
      .map(todo => todo.id);

    setSelectedTodoId(todoToUpdate);

    try {
      await Promise.all(todos.map(todo => (
        editTodo(todo.id, { completed: !isEveryTodoCompleted })
      )));

      setTodos(todos.map(todo => (
        { ...todo, completed: !isEveryTodoCompleted }
      )));
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setSelectedTodoId([]);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={isAdding}
          onChange={setTitle}
          onSubmit={handleSubmitForm}
          newTodoField={newTodoField}
          isTodoCompleted={isEveryTodoCompleted}
          switchTodos={switchAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              selectedTodosId={selectedTodoId}
              removeTodo={removeTodo}
              switchTodo={switchTodo}
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
                  switchTodo={switchTodo}
                  selectedTodosId={selectedTodoId}
                />
              )}

            <Footer
              filterType={filterType}
              isTodoCompleted={isTodoCompleted}
              activeTodosAmount={activeTodosAmount}
              cleanCompletedTodos={cleanCompletedTodos}
              setFilterType={setFilterType}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onCloseErrorMessage={setErrorMessage}
      />
    </div>
  );
};

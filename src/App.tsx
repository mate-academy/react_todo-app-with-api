/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos, deleteTodo, addTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [selectedTodosId, setSelectedTodosId] = useState<number []>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorType.ADD));
    }
  }, []);

  const onAddTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (!title.trim()) {
          setErrorMessage(ErrorType.EMPTY);

          return;
        }

        setIsAddingTodo(true);

        if (user) {
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

          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
          setIsAddingTodo(false);
        }
      } catch (addTodoError) {
        setErrorMessage(ErrorType.ADD);
      }
    }, [todos, user, title],
  );

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setSelectedTodosId(todosIds => [
        ...todosIds,
        todoId,
      ]);
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(
        todo => todo.id !== todoId,
      ));
      setErrorMessage('');
      setSelectedTodosId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.REMOVE);
    }
  }, []);

  const removeCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const onUpdateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Todo>,
  ) => {
    try {
      setSelectedTodosId(todosIds => [
        ...todosIds,
        todoId,
      ]);
      await updateTodo(todoId, updateData);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...updateData }
          : todo
      )));
      setSelectedTodosId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.UPDATE);
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAllTodos = async (
    todoId: number,
    updateData: Partial<Todo>,
  ) => {
    await onUpdateTodo(todoId, updateData);
  };

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        toggleAllTodos(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterType.ALL:
      default:
        return todos;
    }
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
          title={title}
          setTitle={setTitle}
          changeAllTodos={changeAllTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
              isAddingTodo={isAddingTodo}
              onUpdateTodo={onUpdateTodo}
              selectedTodosId={selectedTodosId}
            />
            <Footer
              activeTodos={activeTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              removeCompletedTodos={removeCompletedTodos}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          closeErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

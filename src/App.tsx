/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter, MakeTodosCompleted, Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TempTodo } from './components/TempTodo';

const USER_ID = 11641;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [allTodosCompleted, setAllTodosCompleted] = useState(false);
  const [makeTodosComplete, setMakeTodosComplete] = useState(
    MakeTodosCompleted.begin,
  );
  const [clearCompleted, setClearCompleted] = useState(false);

  useEffect(() => {
    setQuantity(todos.filter((todo) => !todo.completed).length);
  }, [todos]);

  useEffect(() => {
    setErrorMessage('');

    todosService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    const filteredByTodos = todos?.filter((todo) => {
      switch (filterBy) {
        case Filter.active:
          return !todo.completed;
        case Filter.completed:
          return todo.completed;
        default:
          return true;
      }
    })
      ?? [];

    return filteredByTodos;
  }, [filterBy, todos]);

  const deleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setIsFocused(false);

    try {
      await todosService.deleteTodo(todoId);
      const updatedTodos = (currentTodos: Todo[]) => currentTodos
        .filter((todo: Todo) => todo.id !== todoId);

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setIsFocused(true);
    }
  };

  const createNewTodo = async ({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>) => {
    setErrorMessage('');
    try {
      const newTodo = await todosService.addTodo({ title, completed, userId });

      setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    setErrorMessage('');

    try {
      const todo = await todosService.updateTodo(updatedTodo);

      setTodos((currentTodos: Todo[]) => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(post => post.id === updatedTodo.id);

        newTodos.splice(index, 1, todo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    }
  };

  const searchCompletedTodos = () => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  };

  useEffect(() => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  }, [filteredTodos, hasCompleted]);

  useEffect(() => {
    const hasAllCompleted = filteredTodos.every((todo) => todo.completed);

    setAllTodosCompleted(hasAllCompleted);
  }, [filteredTodos, allTodosCompleted]);

  const makeCompleteFn = () => {
    if (allTodosCompleted) {
      setMakeTodosComplete(MakeTodosCompleted.not);
    } else {
      setMakeTodosComplete(MakeTodosCompleted.do);
    }
  };

  const makeClearCompleted = () => {
    if (hasCompleted) {
      setClearCompleted(true);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setTitle={setTodoTitle}
          title={todoTitle}
          addTodo={createNewTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          todos={todos}
          allTodosCompleted={allTodosCompleted}
          makeCompleteFn={makeCompleteFn}
          setMakeTodosComplete={setMakeTodosComplete}
        />

        {!!todos.length && (
          <TodoList
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            todos={filteredTodos}
            searchCompletedTodos={searchCompletedTodos}
            makeTodosComplete={makeTodosComplete}
            clearCompleted={clearCompleted}
            setClearCompleted={setClearCompleted}
            setMakeTodosComplete={setMakeTodosComplete}
          />
        )}
        {!!tempTodo && <TempTodo tempTodo={tempTodo} />}

        {!!todos.length && (
          <Footer
            hasCompleted={hasCompleted}
            setFilterBy={setFilterBy}
            quantity={quantity}
            makeClearCompleted={makeClearCompleted}
          />
        )}
      </div>

      <Notification
        error={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};

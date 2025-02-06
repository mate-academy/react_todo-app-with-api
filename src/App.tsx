/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterOption } from './types/FilterOption';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [option, setOption] = useState(FilterOption.All);

  const [itemsLeft, setItemsLeft] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');

  const [savingTodoIds, setSavingTodoIds] = useState<number[]>([]);

  const [inputDisabled, setInputDisabled] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    todoServise
      .getTodos()
      .then(data => {
        setTodosFromServer(data);
        setItemsLeft(data.filter(todo => !todo.completed).length);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }

  useEffect(() => loadTodos(), []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todosFromServer.length, inputDisabled]);

  useEffect(() => {
    const remainingTasks = todosFromServer.filter(
      todo => !todo.completed,
    ).length;

    setItemsLeft(remainingTasks);
  }, [todosFromServer]);

  const updateTodo = async (todo: Todo) => {
    setErrorMessage('');
    if (savingTodoIds.length > 0) {
      return;
    }

    setSavingTodoIds([todo.id]);

    try {
      await todoServise.updateTodo(todo);
      const index = todosFromServer.findIndex(
        currentTodo => currentTodo.id === todo.id,
      );

      if (index !== -1) {
        const updatedTodos = [...todosFromServer];

        updatedTodos[index] = {
          ...updatedTodos[index],
          completed: todo.completed,
          title: todo.title,
        };
        setTodosFromServer(updatedTodos);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setSavingTodoIds([]);
    }
  };

  const saveAllTodos = async () => {
    if (savingTodoIds.length > 0) {
      return;
    }

    try {
      let updatedTodos: Todo[] = [];

      if (itemsLeft === 0 || itemsLeft === todosFromServer.length) {
        updatedTodos = todosFromServer.map(todo => ({
          ...todo,
          completed: !todo.completed,
        }));
      }

      if (itemsLeft !== 0 && itemsLeft !== todosFromServer.length) {
        updatedTodos = todosFromServer
          .filter(todo => todo.completed === false)
          .map(todo => ({
            ...todo,
            completed: true,
          }));
      }

      setSavingTodoIds(updatedTodos.map(todo => todo.id));

      await Promise.all(updatedTodos.map(todo => todoServise.updateTodo(todo)));

      setTodosFromServer(prevTodos => {
        return prevTodos.map(
          todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
        );
      });
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setSavingTodoIds([]);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setSavingTodoIds([todoId]);

    try {
      await todoServise.deleteTodo(todoId);
      setTodosFromServer(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoId),
      );
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setSavingTodoIds([]);
    }
  };

  const addTodo = async (title: string, onSuccess: () => void) => {
    setInputDisabled(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: todoServise.USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const { userId, completed } = newTempTodo;

      const newTodoFromServer = await todoServise.createTodo({
        userId,
        title,
        completed,
      });

      setTodosFromServer(currentTodos => [...currentTodos, newTodoFromServer]);
      onSuccess();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  };

  const filteredTodos = useMemo(() => {
    return todosFromServer.filter(todo => {
      if (option === FilterOption.Active) {
        return !todo.completed;
      }

      if (option === FilterOption.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todosFromServer, option]);

  const handleClearCompleted = async () => {
    setErrorMessage('');
    const completedTodosId = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setSavingTodoIds([...completedTodosId]);

    try {
      const results = await Promise.allSettled(
        completedTodosId.map(id => todoServise.deleteTodo(id)),
      );

      const successfulTodoIds = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodosId[index] : null,
        )
        .filter((id): id is number => id !== null);

      setTodosFromServer(currentTodos =>
        currentTodos.filter(todo => !successfulTodoIds.includes(todo.id)),
      );

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        setErrorMessage('Unable to delete a todo');
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setSavingTodoIds([]);
    }
  };

  const hasCompletedTodos = todosFromServer.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isToggleButtonExist={todosFromServer.length > 0}
          isAllTodosCompleted={itemsLeft === 0}
          isInputDisabled={inputDisabled}
          onSubmit={addTodo}
          saveAllTodos={saveAllTodos}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        <TodoList
          listOfTodos={filteredTodos}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          savingTodoIds={savingTodoIds}
          tempTodo={tempTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            option={option}
            setOption={setOption}
            handleClearCompleted={handleClearCompleted}
            isClearButtonDisabled={!hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} />
    </div>
  );
};

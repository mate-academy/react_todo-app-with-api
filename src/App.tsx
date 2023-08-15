import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, UpdatedTodo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Error } from './components/Error/Error';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todolist } from './components/Todolist/Todolist';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoStatus } from './types/TodoStatus';

const USER_ID = 10890;

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.noError);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [delUpdTodoIds, setDelUpdTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setVisibleTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.loadError);
      });
  }, []);

  const handleCloseError = () => {
    setErrorMessage(ErrorMessage.noError);
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case TodoStatus.completed:
        return visibleTodos.filter(todo => todo.completed);

      case TodoStatus.active:
        return visibleTodos.filter(todo => !todo.completed);

      default:
        return visibleTodos;
    }
  }, [filter, visibleTodos]);

  const completedTodos = filteredTodos.filter(todo => todo.completed);
  const activeTodos = filteredTodos.filter(todo => !todo.completed);

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setIsLoading(true);
  //   setTempTodo({
  //     id: 0,
  //     title: newTodoTitle,
  //     completed: false,
  //     userId: USER_ID,
  //   });

  //   if (!newTodoTitle.trim()) {
  //     setErrorMessage(ErrorMessage.titleError);
  //     setIsLoading(false);
  //     setTempTodo(null);

  //     return;
  //   }

  //   addTodos(USER_ID, {
  //     title: newTodoTitle,
  //     userId: USER_ID,
  //     completed: false,
  //   })
  //     .then((result) => {
  //       setVisibleTodos((prevTodos) => {
  //         return [result, ...prevTodos];
  //       });
  //     })
  //     .catch(() => {
  //       setErrorMessage(ErrorMessage.addError);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       setTempTodo(null);
  //       setNewTodoTitle('');
  //     });
  // };

  const removeTodo = (todoId: number) => {
    setDelUpdTodoIds((prevState) => [...prevState, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setVisibleTodos(
          visibleTodos.filter(todo => (
            todo.id !== todoId
          )),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
      })
      .finally(() => {
        setDelUpdTodoIds([]);
      });
  };

  const handleRemoveCompleted = () => {
    const todoToRemove = completedTodos.map(todo => {
      setDelUpdTodoIds((prevState) => [...prevState, todo.id]);

      return deleteTodo(todo.id);
    });

    Promise.all(todoToRemove)
      .then(() => {
        setVisibleTodos(activeTodos);
        setDelUpdTodoIds([0]);
      });
  };

  const handleUpdateTodo = useCallback(async (
    todoId: number,
    args: UpdatedTodo,
  ) => {
    if (delUpdTodoIds.includes(todoId)) {
      return;
    }

    setIsLoading(true);
    setDelUpdTodoIds((prevState) => [...prevState, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, args);

      setVisibleTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setErrorMessage(ErrorMessage.updateError);
    } finally {
      setDelUpdTodoIds([]);
      setIsLoading(false);
    }
  }, [delUpdTodoIds]);

  const toggleAll = useCallback(async () => {
    await Promise.all(activeTodos.map(todo => (
      handleUpdateTodo(todo.id, { completed: true })
    )));

    if (!activeTodos.length) {
      await Promise.all(completedTodos.map(todo => (
        handleUpdateTodo(todo.id, { completed: false })
      )));
    }
  }, [completedTodos, activeTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          setTempTodo={setTempTodo}
          isLoading={isLoading}
          toggleAll={toggleAll}
          USER_ID={USER_ID}
          setVisibleTodos={setVisibleTodos}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
        />
        <Todolist
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          handleUpdateTodo={handleUpdateTodo}
          delUpdTodoIds={delUpdTodoIds}
        />

        {visibleTodos.length !== 0 && (
          <Footer
            activeTodos={activeTodos}
            filter={filter}
            setFilter={setFilter}
            completedTodos={completedTodos}
            handleRemoveCompleted={handleRemoveCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          handleCloseError={handleCloseError}
        />
      )}
    </div>
  );
};

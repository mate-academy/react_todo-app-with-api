import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, UpdatedTodo } from './types/Todo';
import {
  addTodos,
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
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setTempTodo({
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.titleError);
      setIsLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setVisibleTodos((prevTodos) => {
          return [result, ...prevTodos];
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.addError);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setNewTodoTitle('');
      });
  };

  const removeTodo = (todoId: number) => {
    setDeletedTodoId((prevState) => [...prevState, todoId]);

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
        setDeletedTodoId([]);
      });
  };

  const handleRemoveCompleted = () => {
    const todoToRemove = completedTodos.map(todo => {
      setDeletedTodoId((prevState) => [...prevState, todo.id]);

      return deleteTodo(todo.id);
    });

    Promise.all(todoToRemove)
      .then(() => {
        setVisibleTodos(activeTodos);
        setDeletedTodoId([0]);
      });
  };

  const handleUpdateTodo = useCallback(async (
    todoId: number,
    args: UpdatedTodo,
  ) => {
    if (updatingTodoIds.includes(todoId)) {
      return;
    }

    setIsLoading(true);
    setUpdatingTodoIds((prevState) => [...prevState, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, args);

      setVisibleTodos(prevTodos => (prevTodos.map((todo: Todo) => (
        todo.id === todoId
          ? updatedTodo
          : todo)) as Todo[]));
    } catch {
      setErrorMessage(ErrorMessage.updateError);
    } finally {
      setUpdatingTodoIds([]);
      setIsLoading(false);
    }
  }, [updatingTodoIds]);

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
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isLoading={isLoading}
          toggleAll={toggleAll}
        />
        <Todolist
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          deletedTodoId={deletedTodoId}
          handleUpdateTodo={handleUpdateTodo}
          updatingTodoIds={updatingTodoIds}
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

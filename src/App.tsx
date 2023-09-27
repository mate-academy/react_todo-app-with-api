/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { FilterLink, preparedTodos } from './utils/TodoFilter';
import { ErrorMessage } from './utils/errorMessages';
import { TodoAppRow } from './components/TodoAppRow/TodoAppRow';
import { TempTodo } from './components/TodoAppRow';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterLink.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [isRequesting, setIsRequesting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (todoTitle: string): Promise<void> => {
    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: todoTitle,
      completed: false,
    });

    setIsRequesting(true);

    return todoService
      .addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.Add);
        throw error;
      })
      .finally(() => {
        setIsRequesting(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);

    todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleUpdateTodo = async (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    return todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        throw new Error();
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleCompletedChange = (todo:Todo) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    todoService
      .updateTodo({
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleDeleteAllCompletedTodos = () => {
    todos
      .filter((todo) => todo.completed)
      .forEach((todo) => handleDeleteTodo(todo.id));
  };

  const visibleTodos = preparedTodos(todos, selectedFilter);

  const todosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isAllCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const hasCompletedTodo = todos.some(({ completed }) => completed);

  const handleToggleButton = () => {
    if (!isAllCompleted) {
      todos
        .filter((todo) => !todo.completed)
        .forEach((todo) => handleCompletedChange(todo));
    }

    if (isAllCompleted) {
      todos
        .filter((todo) => todo.completed)
        .forEach((todo) => handleCompletedChange(todo));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          onToggleClick={handleToggleButton}
          todos={visibleTodos}
          onTodoAdd={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isRequesting={isRequesting}
          isAllCompleted={isAllCompleted}
        />

        {!!todos.length && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map((todo: Todo) => (
                <TodoAppRow
                  todo={todo}
                  key={todo.id}
                  isLoading={processingTodoIds.includes(todo.id)}
                  onTodoDelete={handleDeleteTodo}
                  onChangeBox={() => (
                    handleCompletedChange(todo))}
                  onTodoUpdate={(todoTitle) => (
                    handleUpdateTodo(todo, todoTitle)
                  )}
                />
              ))}

              {tempTodo && (
                <TempTodo todo={tempTodo} />
              )}
            </section>

            <TodoAppFooter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              todosCounter={todosCounter}
              hasCompletedTodo={hasCompletedTodo}
              deleteAllComleted={handleDeleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};

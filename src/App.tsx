import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './utils/UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/Error';

import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

import {
  getFilteredTodos,
  getTotalActiveTodos,
  hasCompletedTodos,
} from './utils/Utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const fieldTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.load));
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filterBy),
    [filterBy, todos],
  );

  const allCompletedTodos = useMemo(() => hasCompletedTodos(todos), [todos]);
  const totalTodosActive = useMemo(() => getTotalActiveTodos(todos), [todos]);

  const onAddTodo = (title: string) => {
    const todo = {
      title,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setTempTodo(todo);

    return createTodo(title)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setError(ErrorMessage.add);
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const onDeleteTodo = (id: number) => {
    setProcessingTodos([id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setProcessingTodos([]);
      })
      .catch(() => setError(ErrorMessage.delete))
      .finally(() => {
        fieldTitle.current?.focus();
      });
  };

  const onDeleteCompleted = () => {
    Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(todo => {
          setProcessingTodos(prev => [...prev, todo.id]);

          deleteTodo(todo.id)
            .then(() =>
              setTodos(prevTodos =>
                prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
              ),
            )
            .catch(() => setError(ErrorMessage.delete));
        }),
    ).then(() => {
      fieldTitle.current?.focus();
      setProcessingTodos([]);
    });
  };

  const onUpdateTodo = (updatedTodo: Todo) => {
    setProcessingTodos(prevIds => [...prevIds, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(todo => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === todo.id ? updatedTodo : prevTodo,
          ),
        );
      })
      .catch(() => {
        setError(ErrorMessage.update);
        throw new Error();
      })
      .finally(() => setProcessingTodos([]));
  };

  const onChangeStatus = () => {
    const todoToToggle = todos.filter(
      todo => todo.completed === allCompletedTodos,
    );

    todoToToggle.map(todo => {
      return onUpdateTodo({
        ...todo,
        completed: !allCompletedTodos,
      }).then(() =>
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.completed === !allCompletedTodos
              ? prevTodo
              : { ...prevTodo, completed: !allCompletedTodos },
          ),
        ),
      );
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={onAddTodo}
          hasTodos={todos.length > 0}
          allCompletedTodos={allCompletedTodos}
          setError={setError}
          fieldTitle={fieldTitle}
          onChangeStatus={onChangeStatus}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDeleteTodo}
          processingTodos={processingTodos}
          onUpdate={onUpdateTodo}
        />

        {!!todos.length && (
          <Footer
            handleFilterChange={setFilterBy}
            filterBy={filterBy}
            totalActiveTodos={totalTodosActive}
            onDeleteCompleted={onDeleteCompleted}
            hasCompletedTodos={todos.length - totalTodosActive}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};

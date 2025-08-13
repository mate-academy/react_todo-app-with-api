/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter/';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

{
  /*const [loading, setLoading] = useState(false);*/
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filtering, setFiltering] = useState<FilterType>(FilterType.all);

  const [isInput, setIsInput] = useState(false);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const field = useRef<HTMLInputElement>(null);
  const returnFocus = () => setTimeout(() => field.current?.focus(), 0);

  const allTodoIsCompleted = todos.every(todo => todo.completed);

  const handleUpdateTodo = (newTodo: Todo) => {
    setProcessingTodos(currentIds => [...currentIds, newTodo.id]);

    return todoService
      .updateTodos(newTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            todoFrom => todoFrom.id === newTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodos);

        throw new Error();
      })
      .finally(() =>
        setProcessingTodos(currentIds =>
          currentIds.filter(id => id !== newTodo.id),
        ),
      );
  };

  const handleChangeAllComplete = () => {
    const notComletedTodos = todos.filter(todo => !todo.completed);

    if (notComletedTodos.length !== 0) {
      notComletedTodos.forEach(todo =>
        handleUpdateTodo({
          title: todo.title,
          id: todo.id,
          userId: todo.userId,
          completed: !todo.completed,
        }),
      );
    }

    if (notComletedTodos.length === 0) {
      todos.forEach(todo =>
        handleUpdateTodo({
          title: todo.title,
          id: todo.id,
          userId: todo.userId,
          completed: !todo.completed,
        }),
      );
    }
  };

  const handleAddTodo = (createdTodo: Todo) => {
    setTempTodo(createdTodo);
    setError(null);
    setIsInput(true);

    const { title, completed, userId } = createdTodo;

    return todoService
      .createTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch(() => {
        setError(ErrorMessage.AddTodos);

        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
        setIsInput(false);

        returnFocus();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodos(currentIds => [...currentIds, todoId]);

    return todoService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(ErrorMessage.DeleteTodos))
      .finally(() => {
        setProcessingTodos(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        returnFocus();
      });
  };

  const handleClearCompleted = () => {
    [...todos]
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const handleSetError = (newError: ErrorMessage) => {
    setError(newError);
  };

  const handleRemoveError = () => {
    setError(null);
  };

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    setError(null);
    field.current?.focus();

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onAdd={handleAddTodo}
          onError={handleSetError}
          onFocus={field}
          isInput={isInput}
          isComleted={allTodoIsCompleted}
          changeAllComplete={handleChangeAllComplete}
          todos={todos}
        />
        <TodoList
          processingTodos={processingTodos}
          todos={todos}
          filterValue={filtering}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          onChange={handleUpdateTodo}
        />
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterValue={filtering}
            setFilter={(value: FilterType) => {
              setFiltering(value);
            }}
            onClear={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification Error={error} onClose={handleRemoveError} />
    </div>
  );
};

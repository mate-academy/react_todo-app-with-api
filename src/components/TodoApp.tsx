import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { Errors } from '../enums/Errors';
import { ErrorNotification } from './ErrorNotification';
import { FilteredTodos } from '../enums/FilteredTodos';
import handleFilteredTodos from '../utils/handleFilteredTodos';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [filterSelected, setFilterSelected] = useState<FilteredTodos>(
    FilteredTodos.all,
  );
  const inputField = useRef<HTMLInputElement>(null);

  const preparedTodos = handleFilteredTodos(todos, filterSelected);
  const activeTodos = handleFilteredTodos(todos, FilteredTodos.active);
  const completedTodos = handleFilteredTodos(todos, FilteredTodos.completed);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const showError = (error: Errors) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    const clearError = setTimeout((error: Errors) => {
      setErrorMessage(error);
    }, 3000);

    return () => clearTimeout(clearError);
  }, [errorMessage, setErrorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError(Errors.LoadTodos));
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    return createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        showError(Errors.AddTodo);
        throw error;
      });
  };

  const delTodo = useCallback(
    (id: number): Promise<void> => {
      return deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
          inputField.current?.focus();
        })
        .catch((error: unknown) => {
          showError(Errors.DeleteTodo);
          throw error;
        });
    },
    [setTodos, inputField, showError],
  );

  const updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo> = (
    id: number,
    data: Partial<Todo>,
  ) => {
    return updateTodo(id, data)
      .then(updtdTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(post => post.id === id);

          newTodos.splice(index, 1, updtdTodo);

          return newTodos;
        });

        return updtdTodo;
      })
      .catch(error => {
        setErrorMessage(Errors.UpdateTodo);
        throw error;
      });
  };

  const onCompleteDelete = useMemo(() => {
    return () => {
      todos.filter(todo => todo.completed).forEach(todo => delTodo(todo.id));
    };
  }, [todos, delTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          addTodo={addTodo}
          preparedTodos={preparedTodos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          clearErrorMessage={clearErrorMessage}
          inputField={inputField}
          loadingTodosIds={loadingTodosIds}
          setLoadingTodosIds={setLoadingTodosIds}
          updtTodo={updtTodo}
          todos={todos}
        />

        <TodoList
          deleteTodo={delTodo}
          tempTodo={tempTodo}
          preparedTodos={preparedTodos}
          updtTodo={updtTodo}
          loadingTodosIds={loadingTodosIds}
          setLoadingTodosIds={setLoadingTodosIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onCompleteDelete={onCompleteDelete}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};

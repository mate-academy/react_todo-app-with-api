import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { Errors } from '../enums/Errors';
import { ErrorNotification } from './ErrorNotification';
import { FilteredTodos } from '../enums/FilteredTodos';

const handleFilteredTodos = (todos: Todo[], filterSelected: FilteredTodos) => {
  switch (filterSelected) {
    case FilteredTodos.active:
      return todos.filter(todo => !todo.completed);
    case FilteredTodos.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterSelected, setFilterSelected] = useState<FilteredTodos>(
    FilteredTodos.all,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [focusInput, setFocusInput] = useState(false);

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
    setFocusInput(true);

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

  const delTodo: (id: number) => Promise<void> = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setFocusInput(true);
      })
      .catch((error: unknown) => {
        showError(Errors.DeleteTodo);
        throw error;
      });
  };

  const updtTodo: (updatedTodo: Todo, data: Partial<Todo>) => Promise<Todo> = (
    updatedTodo: Todo,
    data: Partial<Todo>,
  ) => {
    return updateTodo(updatedTodo, data)
      .then(updtdTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(post => post.id === updatedTodo.id);

          newTodos.splice(index, 1, updtdTodo);

          return newTodos;
        });

        return updatedTodo;
      })
      .catch(error => {
        showError(Errors.UpdateTodo);
        throw error;
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          loadingTodosIds={loadingTodosIds}
          setFocusInput={setFocusInput}
          focusInput={focusInput}
          clearErrorMessage={clearErrorMessage}
          updtTodo={updtTodo}
          setTodos={setTodos}
          setLoadingTodosIds={setLoadingTodosIds}
        />

        <TodoList
          preparedTodos={preparedTodos}
          loadingTodosIds={loadingTodosIds}
          tempTodo={tempTodo}
          deleteTodo={delTodo}
          updtTodo={updtTodo}
          setLoadingTodosIds={setLoadingTodosIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            deleteTodo={delTodo}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            setLoadingTodosIds={setLoadingTodosIds}
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

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
  const isAllSelected = todos.every(todo => todo.completed);

  const clearErrorMessage = () => {
    setErrorMessage(null);
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
      .catch(() => setErrorMessage(Errors.LoadTodos));
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    return createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => setErrorMessage(Errors.AddTodo));
  };

  const delTodo: (id: number) => Promise<void> = (id: number) => {
    setLoadingTodosIds([id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setFocusInput(true);
      })
      .catch(() => {
        setErrorMessage(Errors.DeleteTodo);
      })
      .finally(() => {
        setLoadingTodosIds([]);
      });
  };

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

  const handleToggleAll = () => {
    setLoadingTodosIds(todos.map(todo => todo.id));

    let todosToUpdate;

    if (isAllSelected) {
      todosToUpdate = todos.map(todo =>
        updtTodo(todo.id, { completed: false }),
      );
    } else {
      todosToUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => updtTodo(todo.id, { completed: true }));
    }

    Promise.all(todosToUpdate)
      .catch(error => {
        setErrorMessage(Errors.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodosIds([]);
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
          setLoadingTodosIds={setLoadingTodosIds}
          handleToggleAll={handleToggleAll}
          isAllSelected={isAllSelected}
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

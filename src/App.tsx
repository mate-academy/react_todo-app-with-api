import React, { useCallback, useEffect, useState } from 'react';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { FilterBy } from './utils/enums';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoPatch } from './types/TodoPatch';
import { filterTodos } from './utils/filterTodos';
import { errorMessage } from './utils/errorMessage';

const USER_ID = 10897;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorText, setErrorText] = useState('');
  const [hasError, setHasError] = useState(false);

  const resetError = useCallback(() => {
    setHasError(false);
  }, []);

  const setError = (errorTxt: string) => {
    setErrorText(errorTxt);
    setHasError(true);
    setTimeout(resetError, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const onFilterChange = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  const onAddTodo = async (title: string) => {
    if (!/\S/g.test(title)) {
      setError('Title can\'t be empty');

      return false;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      setError(`Unable to add a todo ${errorMessage(error)}`);
    } finally {
      setTempTodo(null);
    }

    return true;
  };

  const onDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setError(`Unable to delete a todo ${errorMessage(error)}`);
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const onUpdateTodo = useCallback(async (todoId: number, data: TodoPatch) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await updateTodo(todoId, data);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      }));
    } catch (error) {
      setError(`Unable to update a todo ${errorMessage(error)}`);
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  let visibleTodos = [...todos];

  if (filterBy !== FilterBy.All) {
    visibleTodos = filterTodos(todos, filterBy);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          onAddTodo={onAddTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {Boolean(todos.length) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              loadingTodoIds={loadingTodoIds}
            />
            <TodoFilter
              todos={todos}
              statusFilter={filterBy}
              onFilterChange={onFilterChange}
              onDeleteTodo={onDeleteTodo}
            />
          </>
        )}
      </div>

      <ErrorMessage
        isVisible={hasError}
        errorText={errorText}
        clearError={resetError}
      />
    </div>
  );
};

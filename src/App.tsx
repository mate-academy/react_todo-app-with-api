import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
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

const USER_ID = 10897;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorText, setErrorText] = useState<null | string>(null);

  const resetError = () => {
    setErrorText(null);
  };

  const setError = (errorTxt: string) => {
    setErrorText(errorTxt);
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
    } catch {
      setError('Unable to add a todo');
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
    } catch {
      setError('Unable to delete a todo');
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
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const visibleTodos = filterBy === FilterBy.All
    ? todos
    : todos.filter(todo => (
      filterBy === FilterBy.Active
        ? !todo.completed
        : todo.completed
    ));

  if (!USER_ID) {
    return <UserWarning />;
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
        errorText={errorText}
        clearError={resetError}
      />
    </div>
  );
};

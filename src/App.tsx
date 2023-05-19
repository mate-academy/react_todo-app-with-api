/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './enums/FilterBy';
import { getTodos, deleteTodo, updateTodo } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage';
import { USER_ID } from './App.constants';
import { TodoForm } from './components/TodoForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isEditDisabled, setIsEditDisabled] = useState(false);

  const activeTodosNumber = todos.filter(({ completed }) => !completed).length;
  const completedTodosNumber = todos.length - activeTodosNumber;
  const areThereCompleted = completedTodosNumber > 0;

  const findTodoIndexById = (todoId: number) => {
    return todos.findIndex(({ id }) => id === todoId);
  };

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const addLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
  };

  const removeLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
  };

  const loadData = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Failed to load data');
    }
  }, []);

  const handleCompletedChange = useCallback(async (
    todoId: number,
    completed: boolean,
  ) => {
    deleteErrorMessage();

    try {
      addLoadingTodoId(todoId);
      const newTodo = await updateTodo(todoId, { completed });

      setTodos(prevTodos => {
        const todosCopy = [...prevTodos];
        const indexToDelete = findTodoIndexById(newTodo.id);

        todosCopy.splice(indexToDelete, 1, newTodo);

        return todosCopy;
      });
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      removeLoadingTodoId(todoId);
    }
  }, [todos]);

  const handleToggleAll = useCallback(() => {
    deleteErrorMessage();
    setIsEditDisabled(true);

    if (!activeTodosNumber) {
      todos.forEach(todo => {
        handleCompletedChange(todo.id, !todo.completed);
      });

      setIsEditDisabled(false);

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        handleCompletedChange(todo.id, !todo.completed);
      }
    });
    setIsEditDisabled(false);
  }, [todos]);

  const handleTodoDelete = useCallback(async (todoToDeleteId: number) => {
    deleteErrorMessage();

    try {
      addLoadingTodoId(todoToDeleteId);
      await deleteTodo(todoToDeleteId);
      setTodos(prevTodos => prevTodos.filter(
        ({ id }) => todoToDeleteId !== id,
      ));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      removeLoadingTodoId(todoToDeleteId);
    }
  }, []);

  const handleTitleEdit = useCallback(async (
    todoId: number,
    title: string,
  ) => {
    addLoadingTodoId(todoId);
    deleteErrorMessage();

    try {
      if (title.length > 0) {
        const newTodo = await updateTodo(todoId, { title });

        setTodos(prevTodos => {
          const todosCopy = [...prevTodos];
          const indexToDelete = findTodoIndexById(newTodo.id);

          todosCopy.splice(indexToDelete, 1, newTodo);

          return todosCopy;
        });

        return;
      }

      handleTodoDelete(todoId);
    } catch {
      setErrorMessage('Unable to update a todo title');
    } finally {
      removeLoadingTodoId(todoId);
    }
  }, [todos]);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(({ id }) => handleTodoDelete(id));
  }, [todos]);

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(({ completed }) => !completed);

      case FilterBy.Completed:
        return todos.filter(({ completed }) => completed);

      default:
        return todos;
    }
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeTodosNumber > 0,
            })}
            onClick={handleToggleAll}
            disabled={isEditDisabled}
          />

          <TodoForm
            onError={setErrorMessage}
            onChange={setTempTodo}
            onCreate={createTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onDelete={handleTodoDelete}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          onCompletedChange={handleCompletedChange}
          onTitleChange={handleTitleEdit}
        />

        {todos && (
          <Footer
            filter={filterBy}
            onChange={setFilterBy}
            onClear={handleClearCompleted}
            areThereCompleted={areThereCompleted}
            activeTodosNumber={activeTodosNumber}
          />
        )}
      </div>

      <ErrorMessage message={errorMessage} onDelete={deleteErrorMessage} />
    </div>
  );
};

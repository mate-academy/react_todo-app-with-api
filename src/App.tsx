import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './enums/FilterBy';
import { TodoFilter } from './components/TodoFilter';
import { getTodos, deleteTodo, updateTodo } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { USER_ID } from './App.constants';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodosNumber = todos.filter(({ completed }) => !completed).length;
  const completedTodosNumber = todos.length - activeTodosNumber;
  const areThereCompleted = completedTodosNumber > 0;

  const findTodoIndexById = (todoId: number) => {
    return todos.findIndex(({ id }) => id === todoId);
  };

  const getFilteredTodos = useCallback((filter: FilterBy) => {
    switch (filter) {
      case FilterBy.Active:
        return todos.filter(({ completed }) => !completed);

      case FilterBy.Completed:
        return todos.filter(({ completed }) => completed);

      default:
        return todos;
    }
  }, [filterBy, todos]);

  const deleteErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const loadData = useCallback(async () => {
    try {
      deleteErrorMessage();
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
    try {
      deleteErrorMessage();
      const newTodo = await updateTodo(todoId, { completed });

      setTodos(prevTodos => {
        const todosCopy = [...prevTodos];
        const indexToDelete = findTodoIndexById(newTodo.id);

        todosCopy.splice(indexToDelete, 1, newTodo);

        return todosCopy;
      });
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  }, [todos]);

  const handleToggleAll = useCallback(() => {
    deleteErrorMessage();

    if (!activeTodosNumber) {
      todos.forEach(todo => {
        handleCompletedChange(todo.id, !todo.completed);
      });

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        handleCompletedChange(todo.id, !todo.completed);
      }
    });
  }, [todos]);

  const handleTodoDelete = useCallback(async (todoId: number) => {
    try {
      deleteErrorMessage();
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(
        ({ id }) => todoId !== id,
      ));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setTempTodo(null);
    }
  }, [todos]);

  const handleTitleEdit = useCallback(async (
    todoId: number,
    title: string,
  ) => {
    try {
      deleteErrorMessage();
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
      setErrorMessage('Unable to update a todo');
    }
  }, [todos]);

  const handleClearCompleted = useCallback(() => {
    deleteErrorMessage();
    const completedTodos = todos
      .filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => handleTodoDelete(id));
  }, [todos]);

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(filterBy);
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: !activeTodosNumber,
            })}
            onClick={handleToggleAll}
          />

          <TodoForm
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            createTodo={createTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onDelete={handleTodoDelete}
          onCompletedChange={handleCompletedChange}
          tempTodo={tempTodo}
          onTitleChange={handleTitleEdit}
        />

        {todos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodosNumber} items left`}
            </span>

            <TodoFilter
              filter={filterBy}
              onChange={setFilterBy}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!areThereCompleted}
              onClick={handleClearCompleted}
              style={areThereCompleted ? {} : { color: 'white' }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessage message={errorMessage} onDelete={deleteErrorMessage} />
    </div>
  );
};

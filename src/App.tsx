import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getTodos,
  addTodo,
  removeTodo,
  editTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo, ErrorTypes } from './types/types';
import { Filter } from './components/Filter/Filter';
import { NewTodo } from './components/NewTodo/NewTodo';
import NotificationError from
  './components/NotificationError/NotificationError';

const USER_ID = 6846;

export const App: React.FC = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorTypes.none);
  const [tempTodo, setTemptodo] = useState<Todo | null>(null);
  const [isDataUpdated, setIsdataUpdated] = useState(false);
  const [activeIds, setActiveIds] = useState([0]);

  const handleTodoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const resetTempTodo = useCallback(() => {
    setTemptodo(null);
    setActiveIds([0]);
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.some(({ completed }) => completed === true)
  ), [todos]);

  const loadTodos = async () => {
    setIsdataUpdated(true);

    try {
      const todosFromServer = await getTodos(Number(USER_ID));

      setTodos(todosFromServer);
    } catch {
      setError(ErrorTypes.get);
    } finally {
      setIsdataUpdated(false);
      resetTempTodo();
    }
  };

  const handleTodoSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task.trim().length) {
      setError(ErrorTypes.emptyTitle);
      setTask('');

      return;
    }

    setTemptodo({
      id: 0,
      userId: USER_ID,
      title: task,
      completed: false,
    });
    setTask('');

    try {
      await addTodo({
        userId: USER_ID,
        title: task,
        completed: false,
      });
      loadTodos();
    } catch {
      setError(ErrorTypes.add);
      resetTempTodo();
    }
  };

  const setCurrentTodoActive = (id: number) => (
    setActiveIds((activeId) => [...activeId, id])
  );

  const handleRemoveTodo = async (id: number) => {
    setCurrentTodoActive(id);

    try {
      await removeTodo(id);
      loadTodos();
    } catch {
      setError(ErrorTypes.delete);
      resetTempTodo();
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  const resetError = () => setError(ErrorTypes.none);

  const handleCheckboxChange = async (todo: Todo) => {
    setCurrentTodoActive(todo.id);

    try {
      await editTodo({ ...todo, completed: !todo.completed });
      loadTodos();
    } catch {
      setError(ErrorTypes.edit);
      resetTempTodo();
    }
  };

  const handleChangeCompletedAll = () => {
    let allCompletedTodo = true;

    todos.forEach(todo => {
      if (!todo.completed) {
        allCompletedTodo = false;

        handleCheckboxChange(todo);
      }
    });

    if (allCompletedTodo) {
      todos.forEach(todo => handleCheckboxChange(todo));
    }
  };

  const handleTitleChange = async (todo: Todo) => {
    setCurrentTodoActive(todo.id);
    if (!todo.title.length) {
      handleRemoveTodo(todo.id);
    }

    try {
      await editTodo(todo);
      loadTodos();
    } catch {
      setError(ErrorTypes.edit);
      resetTempTodo();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title is-1">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          task={task}
          isDataUpdated={isDataUpdated}
          handleTodoChange={handleTodoChange}
          handleTodoSubmit={handleTodoSubmit}
          handleChangeCompletedAll={handleChangeCompletedAll}
          isAllTodosCompleted={isAllTodosCompleted}
          todos={todos}
        />

        {(todos.length > 0 || tempTodo) && (
          <Filter
            todos={todos}
            tempTodo={tempTodo}
            activeIds={activeIds}
            handleRemoveTodo={handleRemoveTodo}
            handleClearCompleted={handleClearCompleted}
            handleCheckboxChange={handleCheckboxChange}
            handleTitleChange={handleTitleChange}
          />
        )}
      </div>

      {error && (
        <NotificationError
          error={error}
          resetError={resetError}
        />
      )}
    </div>
  );
};

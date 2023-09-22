import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoLoader } from './types/TodoLoader';

import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

import { USER_ID } from './utils/userId';
import { TodoContext } from './components/TodoContext';
import { ErrorContext } from './components/ErrorContext';

export const App: React.FC = () => {
  const { todos, setTodos } = useContext(TodoContext);
  const { setError } = useContext(ErrorContext);
  const [status, setStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    todoLoader,
    setTodoLoader,
  ] = useState<TodoLoader>(TodoLoader.None);

  const filtredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (status) {
      case Status.Active:
        return !completed;
      case Status.Completed:
        return completed;
      default:
        return true;
    }
  }), [status, todos]);

  const isListActive = useMemo(
    () => !!todos.length || tempTodo,
    [todos.length, tempTodo],
  );

  useEffect(() => {
    setError('');
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTempTodoAdd={setTempTodo}
          tempTodo={tempTodo}
          onGlobalLoaderChange={setTodoLoader}
        />

        {isListActive && (
          <>
            <TodoList
              todos={filtredTodos}
              tempTodo={tempTodo}
              globalLoader={todoLoader}
            />
            <TodoFooter
              status={status}
              onStatusChange={setStatus}
              onGlobalLoaderChange={setTodoLoader}
            />
          </>
        )}
      </div>

      <TodoError />
    </div>
  );
};

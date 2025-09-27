/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todoApi';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErorrMessage';
import { TodoHeader } from './components/TodoHeader';
import { getActiveTodos, getCompletedTodos } from './services/todoUtils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.ALL);

  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');

  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadTodos() {
      try {
        const newTodos = await todoService.getTodos();

        setTodos(newTodos);
        setLoaded(true);
      } catch (error) {
        setErrorMessage(ErrorMessage.LOAD);
        throw error;
      }
    }

    loadTodos();
  }, []);

  async function deleteTodo(todoId: number) {
    try {
      setLoadingTodoId(ids => [...ids, todoId]);
      setLoading(true);
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setLoaded(true);
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
      throw error;
    } finally {
      setLoading(false);
      setLoadingTodoId(ids => ids.filter(id => id !== todoId));
    }
  }

  async function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    const temp: Todo = { id: 0, title, userId, completed };

    setTempTodo(temp);
    setLoadingTodoId(ids => [...ids, temp.id]);

    try {
      setLoading(true);
      const newTodo = await todoService.createTodo({
        title,
        userId,
        completed,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorMessage.ADD);
      setTempTodo(null);
      throw error;
    } finally {
      setLoading(false);
      setLoadingTodoId([]);
      setTempTodo(null);
      setLoaded(true);
    }
  }

  async function updateTodo(todoId: number, update: Partial<Omit<Todo, 'id'>>) {
    setLoadingTodoId(ids => [...ids, todoId]);
    setLoading(true);
    try {
      const updatedTodo: Todo = await todoService.updateTodo(todoId, update);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
      throw error;
    } finally {
      setLoading(false);
      setLoadingTodoId(ids => ids.filter(id => id !== todoId));
    }
  }

  function deleteComplitedTodos(isPressed: boolean) {
    if (isPressed) {
      const completedTodos = getCompletedTodos(todos);

      completedTodos.forEach(todo => {
        deleteTodo(todo.id);
      });

      setLoaded(true);
    }
  }

  function updateAllTodos(isPressed: boolean) {
    const isAllCompleted = todos.every(todo => todo.completed);
    const activeTodos = getActiveTodos(todos);

    if (isPressed && isAllCompleted) {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false });
      });
    } else if (isPressed) {
      activeTodos.forEach(todo => {
        updateTodo(todo.id, { completed: true });
      });
    }
  }

  const filtredTodos = useMemo(() => {
    let list = todos;

    if (status === 'Active') {
      list = list.filter(todo => !todo.completed);
    } else if (status === 'Completed') {
      list = list.filter(todo => todo.completed);
    }

    return list;
  }, [status, todos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          loading={loading}
          loaded={loaded}
          onAdd={addTodo}
          onError={setErrorMessage}
          onUpdate={updateAllTodos}
          onClear={setLoaded}
        />

        <TodoList
          todos={filtredTodos}
          isLoading={loading}
          loadingTodoId={loadingTodoId}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={deleteComplitedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClearMessage={() => setErrorMessage('')}
      />
    </div>
  );
};

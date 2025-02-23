import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as apiTodos from './api/todos';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoStatus, setTodoStatus] = useState<Status>(Status.All);
  const [submitting, setSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [waitForResponseIds, setWaitForResponseIds] = useState<number[]>([]);

  const [title, setTitle] = useState('');

  function resetError() {
    setErrorMessage('');
  }

  async function addTodo(todo: Omit<Todo, 'id'>) {
    try {
      setSubmitting(true);

      setTempTodo({ ...todo, id: 0 });

      const newTodo = await apiTodos.addTodo(todo);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(resetError, 3000);
    } finally {
      setTempTodo(null);
      setSubmitting(false);
    }
  }

  async function deleteTodo(todoId: number) {
    try {
      setWaitForResponseIds(currentId => [...currentId, todoId]);

      await apiTodos.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(resetError, 3000);
    } finally {
      setWaitForResponseIds([]);
    }
  }

  async function updateTodo(todoForUpdate: Todo) {
    try {
      setWaitForResponseIds(currentId => [...currentId, todoForUpdate.id]);

      await apiTodos.updateTodo(todoForUpdate);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id == todoForUpdate.id ? todoForUpdate : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(resetError, 3000);
      throw error;
    } finally {
      setWaitForResponseIds([]);
    }
  }

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => {
      switch (todoStatus) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, todoStatus]);

  useEffect(() => {
    apiTodos
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(resetError, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          addTodo={addTodo}
          todos={todos}
          submitting={submitting}
          updateTodo={updateTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          waitForResponseIds={waitForResponseIds}
          updateTodo={updateTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

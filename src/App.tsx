/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo, TodoStatus } from './types/Todo';
import { ErrorNotification } from './ErrorNotification';
import { TodosList } from './TodosList';
import { TodosHeader } from './TodosHeader';
import { TodosFooter } from './TodosFooter';

const USER_ID = 10332;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [todoAddQuery, setTodoAddQuery] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const removeIdFromLoadArray = (array:number[], value:number) => {
    return array.filter((item:number) => item !== value);
  };

  const addTodo = useCallback(
    async (event:React.FormEvent) => {
      event.preventDefault();

      if (!todoAddQuery) {
        setError("Title can't be empty");

        return;
      }

      setLoadingTodoIds([0]);
      setDisableInput(true);
      setTodoAddQuery('');
      setTempTodo({
        id: 0,
        title: todoAddQuery,
        completed: false,
        userId: USER_ID,
      });

      try {
        const response = await client.post<Todo>('/todos', {
          title: todoAddQuery,
          userId: USER_ID,
          completed: false,
        });

        setTodos([...todos, response]);
        setTempTodo(null);
        setLoadingTodoIds([]);
      } catch {
        setError('Unable to add todo');
      }

      setDisableInput(false);
    }, [todoAddQuery, todos],
  );

  const deleteTodo = useCallback(
    async (id:number) => {
      setLoadingTodoIds((prevIds) => [...prevIds, id]);

      try {
        await client.delete(`/todos/${id}`);

        setTodos(todos.filter(todo => todo.id !== id));
      } catch {
        setError('Unable to delete todo');
      }

      setLoadingTodoIds((prevIds) => removeIdFromLoadArray(prevIds, id));
    }, [todos],
  );

  const deleteCompletedTodos = useCallback(
    async () => {
      try {
        await Promise.all(todos
          .filter(todo => todo.completed)
          .map(todo => client.delete(`/todos/${todo.id}`)));

        setTodos(todos.filter(todo => !todo.completed));
      } catch {
        setError('Unable to delete completed todos');
      }
    }, [todos],
  );

  const changeTodoStatus = useCallback(
    async (id:number, completed:boolean) => {
      setLoadingTodoIds((prevIds) => [...prevIds, id]);

      try {
        await client.patch(`/todos/${id}`, {
          completed,
        });

        setLoadingTodoIds((prevIds) => removeIdFromLoadArray(prevIds, id));
        setTodos(todos.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              completed,
            };
          }

          return todo;
        }));
      } catch {
        setError('Unable to change todo status');
      }
    }, [todos],
  );

  const submitEditedTodo = useCallback(
    async (id: number, newTitle: string) => {
      setLoadingTodoIds((prevIds) => [...prevIds, id]);

      try {
        await client.patch(`/todos/${id}`, {
          title: newTitle,
        });

        setLoadingTodoIds((prevIds) => removeIdFromLoadArray(prevIds, id));
        setTodos(todos.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              title: newTitle,
            };
          }

          return todo;
        }));
      } catch {
        setError('Unable to update a todo');
      }
    }, [todos],
  );

  const toggleAllTodos = useCallback(
    async () => {
      const isAllTodosCompleted = todos.every(todo => todo.completed);

      try {
        await Promise.all(todos.map(todo => {
          setLoadingTodoIds((prevIds) => [...prevIds, todo.id]);

          return client.patch(`/todos/${todo.id}`, {
            completed: !isAllTodosCompleted,
          });
        }));

        setLoadingTodoIds([]);
        setTodos(todos.map(todo => ({
          ...todo,
          completed: !isAllTodosCompleted,
        })));
      } catch {
        setError('Unable to toggle all todos');
      }
    }, [todos],
  );

  const handleStatusFilter = useCallback(
    (status: TodoStatus) => {
      setStatusFilter(status);
    }, [],
  );

  const handleInputTodo = useCallback(
    (event:React.ChangeEvent<HTMLInputElement>) => {
      setTodoAddQuery(event.target.value.trim());
    }, [],
  );

  let preparedTodos = todos;

  if (statusFilter) {
    preparedTodos = preparedTodos.filter(todo => {
      switch (statusFilter) {
        case TodoStatus.Uncompleted:
          return !todo.completed;
        case TodoStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }

  const completedTodosLength = preparedTodos
    .filter(todo => todo.completed).length;

  const loadTodos = useCallback(
    async () => {
      try {
        const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(response);
      } catch {
        setError('Unable to load todos');
      }
    }, [],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todoAddQuery={todoAddQuery}
          onInput={handleInputTodo}
          onSubmit={addTodo}
          disableInput={disableInput}
          todos={todos}
          onToggle={toggleAllTodos}
        />

        <TodosList
          todos={preparedTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          onDelete={deleteTodo}
          onChangeStatus={changeTodoStatus}
          onSubmitEdited={submitEditedTodo}
        />

        {todos.length > 0 && (
          <TodosFooter
            onStatusFilter={handleStatusFilter}
            todosQuantity={todos.length}
            statusFilter={statusFilter}
            completedTodosLength={completedTodosLength}
            onDeleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
        />
      )}
    </div>
  );
};

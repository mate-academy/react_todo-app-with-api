import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { editTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

import { AddField } from './components/AddFiled/AddField';
import { Filter } from './components/Filter/Filter';
import { Errors } from './components/Errors/Errors';
import { Todos } from './components/Todos/Todos';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isTodosAvailable, setIsTodosAvailable] = useState(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);

  const loadTodos = useCallback(
    async () => {
      if (!user) {
        return;
      }

      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
        setIsTodosAvailable(true);
      } catch {
        setError(ErrorMessage.NoTodos);
      }
    },
    [user],
  );

  useEffect(() => {
    loadTodos();
  }, [user]);

  const deleteTodoById = useCallback(
    async (todoId: number) => {
      try {
        await removeTodo(todoId);

        await loadTodos();
      } catch {
        setError(ErrorMessage.Delete);
      }
    },
    [],
  );

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return todo;
      }
    })
  ), [todos, status]);

  const completedTodos = visibleTodos.filter(todo => todo.completed);

  const setAllTodosCompleted = useCallback(
    () => {
      try {
        visibleTodos.forEach(async (todo) => {
          if (visibleTodos.length === completedTodos.length) {
            await editTodo(todo.id, { completed: false });
          } else {
            await editTodo(todo.id, { completed: true });
          }

          await loadTodos();
          setIsToggleAllActive(!isToggleAllActive);
        });
      } catch {
        setError(ErrorMessage.Update);
      }
    },
    [visibleTodos],
  );

  const isCompletedExists = completedTodos.length > 0;

  const deleteCompletedTodos = useCallback(
    () => (
      completedTodos.forEach(todo => deleteTodoById(todo.id))
    ),
    [completedTodos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddField
          title={title}
          onTitleChange={setTitle}
          isTodosAvailable={isTodosAvailable}
          onErrorsChange={setError}
          isAdding={isAdding}
          onIsAddingChange={setIsAdding}
          loadTodos={loadTodos}
          setAllTodosCompleted={setAllTodosCompleted}
          isToggleAllActive={isToggleAllActive}
        />

        {isTodosAvailable && (
          <>
            <Todos
              title={title}
              todos={visibleTodos}
              onTodoDelete={deleteTodoById}
              isLoading={isAdding}
              loadTodos={loadTodos}
              onErrorsChange={setError}
            />
            <Filter
              todosQuantity={visibleTodos.length}
              status={status}
              onStatusChange={setStatus}
              isCompletedExists={isCompletedExists}
              deleteCompleted={deleteCompletedTodos}
            />
          </>
        )}

        {error && (
          <Errors
            onErrorsChange={setError}
            visibleError={error}
          />
        )}
      </div>
    </div>
  );
};

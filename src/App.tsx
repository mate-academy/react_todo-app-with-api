/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { NewTodoField } from './components/Auth/NewTodoField/NewTodoField';
import { TodoList } from './components/Auth/TodoList';
import { ErrorNotification } from './components/Auth/ErrorNotification';
import { Status } from './types/Status';
import { Filter } from './components/Auth/Filter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [isAdding, setIsAdding] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);

  const addProcessing = (id: number) => {
    setProcessings(current => [...current, id]);
  };

  const removeProcessing = (idToRemove: number) => {
    setProcessings(current => current.filter(id => id !== idToRemove));
  };

  const loadUserTodos = useCallback(() => {
    if (!user) {
      return;
    }

    setError('');

    try {
      getTodos(user.id)
        .then(setTodos);
    } catch {
      setError('Can not load todos');
    }
  }, [user]);

  useEffect(() => {
    loadUserTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title) {
        setError('Title can\'t be empty');

        return;
      }

      setIsAdding(true);

      if (title.trim() !== '' && user) {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        loadUserTodos();

        setTitle('');
        setIsAdding(false);
      } else {
        setError('Unable to add todo');
      }
    }, [title, user],
  );

  const removeTodo = useCallback(
    async (todoId: number) => {
      addProcessing(todoId);
      setError('');

      deleteTodo(todoId)
        .then(() => {
          setTodos((curTodos) => curTodos.filter(todo => todo.id !== todoId));
        })
        .catch(() => setError('Unable to delete a todo'))
        .finally(() => removeProcessing(todoId));
    }, [],
  );

  const filterTodosByStatus = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return true;
      }
    })
  ), [status, todos]);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const removeCompleted = () => {
    completedTodos.map(todo => removeTodo(todo.id));
  };

  const updateTodoData = useCallback(
    async (updatedTodo: Todo) => {
      addProcessing(updatedTodo.id);
      setError('');

      try {
        try {
          await updateTodo(updatedTodo);
          setTodos(curTodos => curTodos.map(
            todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
          ));
        } catch {
          setError('Unable to update a todo');
        }
      } finally {
        removeProcessing(updatedTodo.id);
      }
    }, [],
  );

  const changeAllTodosStatus = () => {
    const isAllCompleted = activeTodos.length === 0;
    const todosToToggle = isAllCompleted ? completedTodos : activeTodos;

    todosToToggle.forEach(todo => {
      updateTodoData({ ...todo, completed: !isAllCompleted });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: completedTodos.length === todos.length,
                },
              )}
              onClick={changeAllTodosStatus}
            />
          )}

          <NewTodoField
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodosByStatus}
              onDelete={removeTodo}
              onUpdate={updateTodoData}
              isProcessed={processings}
              isAdding={isAdding}
              title={title}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <Filter status={status} onStatusChange={setStatus} />

              <button
                data-cy="ClearCompletedButton"
                type="button"
                disabled={completedTodos.length === 0}
                className={classNames(
                  'todoapp__clear-completed',
                  {
                    'todoapp__clear-completed-hidden':
                      completedTodos.length === 0,
                  },
                )}
                onClick={removeCompleted}
              >
                Clear completed
              </button>

            </footer>
          </>
        )}
      </div>

      <ErrorNotification error={error} onErrorChange={setError} />
    </div>
  );
};

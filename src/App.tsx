import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodos,
  deleteTodos,
  USER_ID,
  updateTodos,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { filterTodos } from './utils/FilterTodo';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterBy>(FilterBy.All);
  const [currentTodoIds, setCurrentTodoIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const filtered = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  const handleNewTodo = (newTodo: Todo) => {
    const newTodoWithStatus = { ...newTodo, isPending: true };
    const newTodosList = [...todos, newTodoWithStatus];

    setIsInputDisabled(true);
    setCurrentTodoIds([...currentTodoIds, newTodo.id]);
    setTodos(newTodosList);

    addTodos(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === newTodo.id
              ? { ...todo, id: todoFromServer.id, isPending: false }
              : todo,
          ),
        );
        setQuery('');
      })
      .catch(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== newTodo.id),
        );
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setCurrentTodoIds([]);
        setIsInputDisabled(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setCurrentTodoIds([...currentTodoIds, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(ErrorMessage.Delete))
      .finally(() => setCurrentTodoIds([]));
  };

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, inputRef, todos]);

  const activeTodos = todos.filter(todo => !todo.completed && !todo.isPending);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const failedDeletions: Todo[] = [];

    Promise.all(
      completedTodos.map(todo =>
        deleteTodos(todo.id).catch(() => {
          failedDeletions.push(todo);
        }),
      ),
    ).finally(() => {
      if (failedDeletions.length) {
        setError(ErrorMessage.Delete);
      }

      const newTodos = todos.filter(
        todo =>
          !todo.completed ||
          failedDeletions.some(failed => failed.id === todo.id),
      );

      setTodos(newTodos);
    });
  };

  const isToggleAllActive = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    let updatedTodos: Todo[];

    setCurrentTodoIds(todos.map(todo => todo.id));

    if (isToggleAllActive) {
      updatedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));
    } else {
      updatedTodos = todos
        .filter(todo => !todo.completed)
        .map(todo => ({
          ...todo,
          completed: true,
        }));
    }

    Promise.all(updatedTodos.map(todo => updateTodos(todo)))
      .then(() => {
        if (isToggleAllActive) {
          setTodos(updatedTodos);
        } else {
          setTodos(prevTodos =>
            prevTodos.map(todo => {
              if (isToggleAllActive) {
                return todo;
              }

              return { ...todo, completed: true };
            }),
          );
        }
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo); //
        setTodos(prevTodos => prevTodos);
      })
      .finally(() => setCurrentTodoIds([]));
  };

  const toggleTodoStatus = (updatedTodo: Todo) => {
    const updatedTodoCopy = { ...updatedTodo };

    setCurrentTodoIds([...currentTodoIds, updatedTodoCopy.id]);

    updatedTodoCopy.completed = !updatedTodoCopy.completed;
    updateTodos(updatedTodoCopy)
      .then(() => {
        setTodos(currentTodo =>
          currentTodo.map(todo =>
            todo.id === updatedTodoCopy.id
              ? { ...todo, completed: updatedTodoCopy.completed }
              : todo,
          ),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
        setTodos(prevTodos => prevTodos);
      })
      .finally(() => setCurrentTodoIds([]));
  };

  const handleRenamingTodo = (renamedTodo: Todo) => {
    setCurrentTodoIds([...currentTodoIds, renamedTodo.id]);

    return updateTodos(renamedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === renamedTodo.id ? renamedTodo : todo,
          ),
        );
      })
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() => setCurrentTodoIds([]));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodo={handleNewTodo}
          onError={setError}
          isInputDisabled={isInputDisabled}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          isToggleAllActive={isToggleAllActive}
          todos={todos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleStatus={toggleTodoStatus}
              handleDeleteTodo={handleDeleteTodo}
              isLoading={currentTodoIds.includes(todo.id)}
              onRenamingTodo={handleRenamingTodo}
            />
          ))}
        </section>

        {todos.length !== 0 && (
          <Footer
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            activeTodos={activeTodos}
          />
        )}
      </div>

      <Errors error={error} onClearError={setError} />
    </div>
  );
};

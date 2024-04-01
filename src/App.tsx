import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  setCompletedTodo,
  setTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Error';
import { Filter } from './types/Filter';
import { filterTodo } from './utils/helpers';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const filteredTodo = filterTodo(todos, filter);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setError(Errors.Load);
      }

      setIsLoading(false);
    };

    getData();
  }, []);

  const areAllCompleted = todos.every(todo => todo.completed);

  const addNewTodo = () => {
    const titleTrimmed = title.trim();

    if (!titleTrimmed) {
      setError(Errors.EmptyTitle);

      return;
    }

    const temp = {
      title: titleTrimmed,
      id: 0,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);
    setError(null);

    postTodo(temp)
      .then(res => {
        setTodos(prev => [...prev, res]);
        setTitle('');
      })
      .catch(() => setError(Errors.Add))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteCurrentTodo = useCallback((id: number) => {
    setDeleteTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(Errors.Delete);
      })
      .finally(() => setDeleteTodoId(null));
  }, []);

  const clearCompleted = async () => {
    const todoIdsToClear: number[] = [];

    try {
      for (const todo of todos) {
        if (todo.completed) {
          try {
            await deleteTodo(todo.id);
            todoIdsToClear.push(todo.id);
          } catch {
            setError(Errors.Delete);
          }
        }
      }

      setTodos(prevState =>
        prevState.filter(todo => !todoIdsToClear.includes(todo.id)),
      );
    } catch {
      setError(Errors.Delete);
    }
  };

  const toggleAll = async () => {
    try {
      const isAnyUncompleted = todos.some(todo => !todo.completed);

      const completedValue = isAnyUncompleted ? true : false;

      await Promise.all(
        todos.map(async todo => {
          try {
            if (todo.completed !== completedValue) {
              await setCompletedTodo({
                id: todo.id,
                completed: completedValue,
              });
            }
          } catch {
            setError(Errors.Update);
          }
        }),
      );

      setTodos(prevTodos =>
        prevTodos.map(prevTodo => ({
          ...prevTodo,
          completed: completedValue,
        })),
      );
    } catch {
      setError(Errors.Update);
    }
  };

  const editTodoTitle = async (id: number, newTitle: string) => {
    try {
      const updatedTodo = await setTodoTitle({ id, title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );
    } catch {
      setError(Errors.Update);
    }
  };

  const toggleCompleted = async (id: number) => {
    try {
      await setCompletedTodo({
        id,
        completed: !todos.find(todo => todo.id === id)?.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch {
      setError(Errors.Update);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          toggleAll={toggleAll}
          inputRef={inputRef}
          title={title}
          setTitle={setTitle}
          disabled={!!tempTodo}
          tempAddTodo={addNewTodo}
          areAllCompleted={areAllCompleted}
          todoslength={todos.length}
        />

        {isLoading ? (
          <p className="todoapp__loading">Loading...</p>
        ) : (
          <TodoList
            toggleCompleted={toggleCompleted}
            setError={setError}
            tempTodo={tempTodo}
            filteredTodo={filteredTodo}
            deleteCurrentTodo={deleteCurrentTodo}
            deleteTodoId={deleteTodoId}
            editTodoTitle={editTodoTitle}
          />
        )}

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification setError={setError} error={error} />
    </div>
  );
};

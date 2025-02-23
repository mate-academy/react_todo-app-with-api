/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { TodoList } from './components/todoList';
import { Error as ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

import { Todo } from './types/Todo';
import { FilterTupes } from './types/Filters';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterTupes.All);
  const [tempTodoTitle, setTempTodoTitle] = useState<string | null>('');
  const [idsProccesing, setIdsProccesing] = useState<number[]>([]);

  const ref = useRef<HTMLInputElement | null>(null);

  const handleAddTodo = async (title: string) => {
    const formattedTitle = title.trim();

    if (!formattedTitle) {
      setErrorMessage(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: formattedTitle,
      completed: false,
      userId: USER_ID,
    };

    try {
      setTempTodoTitle(title);

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage(ErrorMessages.ENABLE_TO_ADD_TODO);
      throw new Error();
    } finally {
      setTempTodoTitle(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setIdsProccesing([id]);
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessages.ENABLE_TO_DELETE_TODO);
    } finally {
      setIdsProccesing([]);
    }
  };

  const handleEditTodo = async (id: number, data: Partial<Todo>) => {
    try {
      setIdsProccesing([id]);
      const editedTodo = await patchTodo(id, data);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (todo.id === id) {
            return editedTodo;
          }

          return todo;
        }),
      );
    } catch {
      setErrorMessage(ErrorMessages.ENABLE_TO_UPDATE_TODO);
      throw new Error(ErrorMessages.ENABLE_TO_UPDATE_TODO);
    } finally {
      setIdsProccesing([]);
    }
  };

  const clearCompletedTodos = async () => {
    const filteredTodos = todos.filter(todo => todo.completed);
    const completedIds = filteredTodos.map(todo => todo.id);

    setIdsProccesing(completedIds);

    try {
      const deleteCallback = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: 'resolved' };
        } catch {
          setErrorMessage(ErrorMessages.ENABLE_TO_DELETE_TODO);

          return { id: todo.id, status: 'rejected' };
        } finally {
          setIdsProccesing([]);
        }
      };

      const response = await Promise.allSettled(
        filteredTodos.map(deleteCallback),
      );

      const resolvedIds = response.reduce(
        (acc, item) => {
          if (item.status === 'rejected') {
            return acc;
          }

          if (item.value.status === 'resolved') {
            return { ...acc, [item.value.id]: item.value.id };
          }

          return acc;
        },
        {} as Record<number, number>,
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => !(resolvedIds[todo.id] && todo.completed)),
      );
    } catch {
      setErrorMessage(ErrorMessages.ENABLE_TO_CLEAR_COMPLETED_TODO);
    }
  };

  const filterTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filter) {
      case FilterTupes.Active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case FilterTupes.Completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [todos, filter]);

  const todosCount = useMemo(() => {
    const active = todos.filter(({ completed }) => !completed).length;
    const completed = todos.length - active;

    return {
      active,
      completed,
    };
  }, [todos]);

  const handleToggleAll = async () => {
    if (todosCount.completed === todos.length) {
      try {
        setIdsProccesing(todos.map(todo => todo.id));

        const updatedTodos = await Promise.all(
          todos.map(todo => patchTodo(todo.id, { completed: false })),
        );

        setTodos(updatedTodos);
      } catch {
        setErrorMessage(ErrorMessages.ENABLE_TO_UPDATE_TODO);
      } finally {
        setIdsProccesing([]);
      }

      return;
    }

    const filteredTodos = todos.filter(todo => !todo.completed);
    const activeIds = filteredTodos.map(todo => todo.id);

    setIdsProccesing(activeIds);

    try {
      await Promise.all(
        filteredTodos.map(todo => patchTodo(todo.id, { completed: true })),
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (!todo.completed) {
            return { ...todo, completed: true };
          }

          return todo;
        }),
      );
    } catch {
      setErrorMessage(ErrorMessages.ENABLE_TO_UPDATE_TODO);
    } finally {
      setIdsProccesing([]);
    }
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.ENABLE_TO_LOAD_TODO));
  }, []);

  useEffect(() => {
    ref.current?.focus();
  }, [todos.length, tempTodoTitle]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          onToggleAll={handleToggleAll}
          inputRef={ref}
          todosCount={todosCount}
        />

        <TodoList
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          todos={filterTodos}
          tempTodoTitle={tempTodoTitle}
          idsProccesing={idsProccesing}
        />

        {!!todos.length && (
          <Footer
            onFilter={setFilter}
            onClear={clearCompletedTodos}
            todosCount={todosCount}
            selectedFilter={filter}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};

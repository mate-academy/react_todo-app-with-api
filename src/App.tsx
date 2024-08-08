/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { List } from './components/List';
import { ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessages } from './types/ErrorMessages';
import { useFilterTodos } from './services/useFilterTodos';
import { useTodosCountByStatus } from './services/todosCountByStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodoTitle, setTempTodoTitle] = useState<string | null>('');
  const [idsProccesing, setIdsProccesing] = useState<number[]>([]);
  const ref = useRef<HTMLInputElement | null>(null);

  const handleAddTodo = async (title: string) => {
    const formattedTitle = title.trim();

    if (!formattedTitle) {
      setErrorMessage(ErrorMessages.TitleEmpty);
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
      setErrorMessage(ErrorMessages.UnableToAddTodo);
      throw new Error(ErrorMessages.UnableToAddTodo);
    } finally {
      setTempTodoTitle(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessages.UnableToDeleteTodo);
    }
  };

  const handleEditTodo = async (id: number, data: Partial<Todo>) => {
    try {
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
      setErrorMessage(ErrorMessages.UnableToUpdateTodo);
      throw new Error(ErrorMessages.UnableToUpdateTodo);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setIdsProccesing(completedTodoIds);

    try {
      const deleteCallback = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: 'resolved' };
        } catch {
          setErrorMessage(ErrorMessages.UnableToDeleteTodo);

          return { id: todo.id, status: 'rejected' };
        } finally {
          setIdsProccesing([]);
        }
      };

      const result = await Promise.allSettled(
        completedTodos.map(deleteCallback),
      );

      const resolvedIds = result.reduce(
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
      setErrorMessage(ErrorMessages.UnableToClearCompletedTodos);
    }
  };

  const filteredTodos = useFilterTodos(todos, filter);
  const todosCount = useTodosCountByStatus(todos);

  const handleToggleAll = async () => {
    if (todosCount.completed === todos.length) {
      try {
        setIdsProccesing(todos.map(todo => todo.id));

        const updatedTodos = await Promise.all(
          todos.map(todo => patchTodo(todo.id, { completed: false })),
        );

        setTodos(updatedTodos);
      } catch {
        setErrorMessage(ErrorMessages.UnableToUpdateTodo);
      } finally {
        setIdsProccesing([]);
      }

      return;
    }

    const activeTodos = todos.filter(todo => !todo.completed);
    const activeIds = activeTodos.map(todo => todo.id);

    setIdsProccesing(activeIds);

    try {
      await Promise.all(
        activeTodos.map(todo => patchTodo(todo.id, { completed: true })),
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
      setErrorMessage(ErrorMessages.UnableToUpdateTodo);
    } finally {
      setIdsProccesing([]);
    }
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages. UnableToLoadTodos));
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

        <List
          todos={filteredTodos}
          tempTodoTitle={tempTodoTitle}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          idsProccesing={idsProccesing}
        />


        {todos.length > 0 && (
          <Footer
            onFilter={setFilter}
            onClear={clearCompletedTodos}
            todosCount={todosCount}
            selectedFilter={filter}
          />
        )}
      </div>

      
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};

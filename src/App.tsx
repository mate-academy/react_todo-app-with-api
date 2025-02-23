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
import { List } from './components/List';
import { Error as ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

// Main App component
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodoTitle, setTempTodoTitle] = useState<string | null>('');
  const [idsProcessing, setIdsProcessing] = useState<number[]>([]);

  const ref = useRef<HTMLInputElement | null>(null);

  // Handle adding a new todo
  const handleAddTodo = async (title: string) => {
    const formattedTitle = title.trim();

    if (!formattedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title: formattedTitle,
      completed: false,
      userId: USER_ID,
    };

    try {
      setTempTodoTitle(title); // Show the temporary todo
      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
      throw new Error('Unable to add a todo');
    } finally {
      setTempTodoTitle(null);
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      setIdsProcessing([id]);
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIdsProcessing([]);
    }
  };

  // Handle editing a todo
  const handleEditTodo = async (id: number, data: Partial<Todo>) => {
    try {
      setIdsProcessing([id]);
      const editedTodo = await patchTodo(id, data);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === id ? editedTodo : todo)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setIdsProcessing([]);
    }
  };

  // Handle clearing completed todos
  const clearCompletedTodos = async () => {
    const filteredTodos = todos.filter(todo => todo.completed);
    const completedIds = filteredTodos.map(todo => todo.id);

    setIdsProcessing(completedIds);

    try {
      const deleteCallback = async (todo: Todo) => {
        try {
          await deleteTodo(todo.id);

          return { id: todo.id, status: 'resolved' };
        } catch {
          setErrorMessage('Unable to delete a todo');

          return { id: todo.id, status: 'rejected' };
        } finally {
          setIdsProcessing([]);
        }
      };

      const res = await Promise.allSettled(filteredTodos.map(deleteCallback));

      const resolvedIds = res.reduce(
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
      setErrorMessage('Unable to clear completed todos');
    }
  };

  // Filter todos based on the selected filter
  const filterTodos = useMemo(() => {
    let filteredTodos = todos;

    switch (filter) {
      case Filter.Active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case Filter.Completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  }, [todos, filter]);

  // Count active and completed todos
  const todosCount = useMemo(() => {
    const active = todos.filter(({ completed }) => !completed).length;
    const completed = todos.length - active;

    return {
      active,
      completed,
    };
  }, [todos]);

  // Handle toggling all todos
  const handleToggleAll = async () => {
    if (todosCount.completed === todos.length) {
      try {
        setIdsProcessing(todos.map(todo => todo.id));
        const updatedTodos = await Promise.all(
          todos.map(todo => patchTodo(todo.id, { completed: false })),
        );

        setTodos(updatedTodos);
      } catch {
        setErrorMessage('Unable to update todos');
      } finally {
        setIdsProcessing([]);
      }

      return;
    }

    const filteredTodos = todos.filter(todo => !todo.completed);
    const activeIds = filteredTodos.map(todo => todo.id);

    setIdsProcessing(activeIds);

    try {
      await Promise.all(
        filteredTodos.map(todo => patchTodo(todo.id, { completed: true })),
      );
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          !todo.completed ? { ...todo, completed: true } : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setIdsProcessing([]);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  // Focus input field when todos length changes or a temporary todo is set
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
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          todos={filterTodos}
          tempTodoTitle={tempTodoTitle}
          idsProccesing={idsProcessing}
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

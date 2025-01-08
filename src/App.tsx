import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import classNames from 'classnames';
import { FilterState } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>(FilterState.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Завантаження списку todo при старті
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        const todosFromApi = await getTodos();

        setTodos(todosFromApi);
      } catch (err) {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  // Автоматичне ховання помилки через 3 секунди
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Фільтрування для виведення у <TodoList />
  const filteredTodos = todos.filter(todo => {
    if (filter === FilterState.Active) {
      return !todo.completed;
    }

    if (filter === FilterState.Completed) {
      return todo.completed;
    }

    return true;
  });

  // Додавання нового todo
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodoTitle.trim();

    setIsSubmitting(true);

    const newTempTodo: Todo = {
      id: Date.now(), // тимчасовий ID
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    // Додаємо тимчасово в список
    setTodos(prevTodos => [...prevTodos, newTempTodo]);
    setTempTodo(newTempTodo);

    try {
      // Відправляємо на сервер
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      // Замінюємо тимчасовий todo реальним із бека
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === newTempTodo.id ? createdTodo : todo,
        ),
      );
      setNewTodoTitle('');
    } catch (err) {
      setError('Unable to add a todo');
      setTodos(prevTodos =>
        prevTodos.filter(todo => todo.id !== newTempTodo.id),
      );
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
    }
  };

  // Фокус на полі після відправлення
  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  // Лічильник активних (незавершених) завдань
  const activeCount = todos.filter(
    todo => !todo.completed && todo !== tempTodo,
  ).length;

  // Видалення одного завдання
  const handleDelete = async (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    // Встановлюємо завдання у "процесі"
    setTempTodo(todoToDelete);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Видалення всіх завершених
  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        await handleDelete(todo.id);
      } catch {
        // Помилка вже оброблена в handleDelete
      }
    }
  };

  // Перемикання completed для одного завдання
  const handleToggle = async (todoId: number, completed: boolean) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setTempTodo(todoToUpdate);

    try {
      const updated = await updateTodo(todoId, { completed });

      // Оновити в стейті лише одне поле completed
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updated : todo)),
      );
    } catch (err) {
      setError('Unable to update a todo');
    } finally {
      setTempTodo(null);
    }
  };

  // Перемикання completed для всіх завдань
  const handleToggleAll = async () => {
    // Перевіряємо, чи всі уже завершені
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    // Окремо оновлюємо кожне завдання
    const promises = todos.map(async todo => {
      if (todo.completed === newStatus) {
        return;
      }

      try {
        const updatedTodo = await updateTodo(todo.id, { completed: newStatus });

        setTodos(prev =>
          prev.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      } catch (err) {
        setError('Unable to update a todo');
        // !!! Прибрали throw err
      }
    });

    await Promise.all(promises);
  };

  // Перейменування завдання
  const handleUpdateTitle = async (
    todoId: number,
    newTitle: string,
    onSuccess?: () => void,
  ) => {
    try {
      const updatedTodo = await updateTodo(todoId, { title: newTitle });

      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Unable to update a todo');
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          todos={todos}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loading={loading}
          handleDelete={handleDelete}
          setError={setError}
          handleToggle={handleToggle}
          handleUpdateTitle={handleUpdateTitle}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
            todos={todos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};

export default App;

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/filterStatus';
import { ErrorMessage } from './types/errorMessage';
import { TodoHeader } from './components/todoHeader/todoHeader';
import { TodoFooter } from './components/todoFooter/todoFooter';
import { TodoMain } from './components/todoMain/todoMain';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // Стан для збереження списку справ, завантажених з сервера
  const [todos, setTodos] = useState<Todo[]>([]);
  // Стан для збереження тексту помилки (LOAD, EMPTY_TITLE тощо)
  const [errorMessage, setErrorMessage] = useState('');
  // Стан для контролю значення в інпуті додавання нової справи
  const [newTodoTitle, setNewTodoTitle] = useState('');
  // Стан для блокування інпуту під час запиту до API
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Стан для поточного фільтра (all, active, completed)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // В App.tsx додайте стан:
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Функція, яка буде фокусувати інпут
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Ефект для первинного завантаження справ при мовтуванні компонента
  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(response => {
        // Записуємо отримані з сервера справи у стан
        setTodos(response);
      })
      .catch(() => {
        // У разі помилки завантаження показуємо відповідне повідомлення
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  // Ефект автоматичного приховання повідомлення про помилку через 3 секунди
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    // Запускаємо таймер очищення помилки
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    // Очищаємо таймер при зміні помилки або розмонтуванні ефекту
    return () => clearTimeout(timerId);
  }, [errorMessage]);

  // Фільтрація справ на основі поточного filterStatus
  const visibleTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.ACTIVE) {
      return !todo.completed; // Повертаємо тільки неліквидовані справи
    }

    if (filterStatus === FilterStatus.COMPLETED) {
      return todo.completed; // Повертаємо тільки виконані справи
    }

    return true; // Для фільтра ALL повертаємо весь список
  });

  // Обробник створення нової справи
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
        // Додаємо очищення tempTodo тут, після успішного запиту
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
        // Прибираємо тимчасову справу, бо запит не вдався
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
        // Фокус інпуту після того, як React оновив DOM
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteTodo = async (id: number): Promise<void> => {
    // Додаємо ID справи в масив обробки
    setProcessingIds(prev => [...prev, id]);

    const previousTodos = [...todos];

    try {
      await client.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
      setTodos(previousTodos);
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // Створюємо масив промісів
    const promises = completedTodos.map(todo => deleteTodo(todo.id));

    // Чекаємо завершення всіх запитів
    await Promise.allSettled(promises);

    // Після того, як все завершилося (успішно чи ні),
    // ми оновлюємо список, отримавши свіжі дані з сервера
    // повторно завантажити актуальний список:
    getTodos().then(setTodos);
  };

  const updateTodo = async (id: number, data: Partial<Todo>): Promise<void> => {
    // 1. Додаємо ID справи в масив обробки, щоб показати лоадер
    setProcessingIds(prev => [...prev, id]);

    // 2. Зберігаємо попередній стан на випадок помилки (щоб можна було відкотити зміни)
    const previousTodos = [...todos];

    try {
      // 3. Викликаємо нашу функцію patchTodo з API, передаючи ID та дані для оновлення.
      // Зберігаємо відповідь сервера (оновлене завдання) у змінну updatedTodo.
      const updatedTodo = await patchTodo(id, data);

      // 4. Оновлюємо стан: проходимось по масиву за допомогою map
      setTodos(prev =>
        prev.map(todo => {
          if (todo.id === id) {
            return updatedTodo;
          } else {
            return todo;
          }
        }),
      );
    } catch (error) {
      // 5. У разі помилки показуємо правильне повідомлення та повертаємо старий масив завдань
      setErrorMessage(ErrorMessage.UPDATE);
      setTodos(previousTodos);
    } finally {
      // 6. Прибираємо ID з масиву обробки, ховаючи лоадер
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));

      // 7. Повертаємо фокус в інпут
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Обробник натискання на кнопку "Toggle All"
  const handleToggleAll = () => {
    // 1. Визначаємо, чи всі справи вже виконані
    const isAllCompleted = todos.every(todo => todo.completed);

    // 2. Встановлюємо новий статус для всіх справ
    const newCompletedStatus = !isAllCompleted;

    // 3. Відбираємо тільки ті справи, які треба змінити
    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    // 4. Для кожної справи відправляємо запит на оновлення
    todosToUpdate.forEach(todo => {
      // updateTodo — це функція, яка робить API-запит до сервера
      updateTodo(todo.id, { completed: newCompletedStatus });
    });
  };

  // Перевірка наявності ідентифікатора користувача
  if (!USER_ID) {
    return <UserWarning />;
  }

  // Створюємо масив, який враховує і серверні, і тимчасову справу
  const todosForRender = [...visibleTodos];

  if (tempTodo) {
    todosForRender.push(tempTodo);
  }

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isSubmitting={isSubmitting}
          focusInput={inputRef}
          handleToggleAll={handleToggleAll}
          isAllCompleted={isAllCompleted}
          hasTodos={todos.length > 0}
        />

        {/* Показуємо Main та Footer лише коли є справи */}
        {todos.length > 0 && (
          <>
            <TodoMain
              visibleTodos={todosForRender}
              processingIds={processingIds}
              deleteTodo={deleteTodo}
              onUpdate={updateTodo}
            />

            <TodoFooter
              todos={todos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {/* Контейнер помилки, який приховується за допомогою класу hidden */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

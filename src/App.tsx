/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import * as todoServices from './api/todos';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.default,
  );
  const [currentFilter, setCurrentFilter] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const [inputValue, setInputValue] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);

    todoServices
      .getTodos()
      .then(setTodoList)
      .catch(() => {
        setErrorMessage(ErrorMessages.getError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const areAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  const filteredTodos = useMemo(() => {
    return todoList.filter(todo => {
      switch (currentFilter) {
        case FilterType.All:
          return true;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;
      }
    });
  }, [currentFilter, todoList]);

  const deleteTodo = useCallback(async (todoId: number) => {
    setLoadingIds(ids => [...ids, todoId]);
    todoServices
      .deletePost(todoId)
      .then(() => {
        setTodoList(currentTodo =>
          currentTodo.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.deleteError);
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  }, []);

  const addPost = useCallback((title: string) => {
    const newTitle = title.trim();

    if (!newTitle.trim()) {
      return setErrorMessage(ErrorMessages.emptyTitleError);
    }

    const tempNewTodo: Todo = {
      id: 0,
      userId: todoServices.USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo(tempNewTodo);
    setIsLoading(true);
    setLoadingIds(currentIds => [...currentIds, 0]);

    return todoServices
      .addPost(newTitle)
      .then(newTodo => {
        setTodoList(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.addError);
        setInputValue(newTitle);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingIds([]);
      });
  }, []);

  const updateTodo = useCallback(async (todoToUpdate: Todo) => {
    setErrorMessage(ErrorMessages.default);
    setIsLoading(true);

    setLoadingIds(currentIds => [...currentIds, todoToUpdate.id]);

    try {
      try {
        const updatedTodo = await todoServices.updateTodo(todoToUpdate);

        setTodoList(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      } catch (error) {
        setErrorMessage(ErrorMessages.updateError);
        throw error;
      }
    } finally {
      setIsLoading(false);
      setLoadingIds(currentIds =>
        currentIds.filter(id => id !== todoToUpdate.id),
      );
    }
  }, []);

  const toggleAllTodos = useCallback(() => {
    const newStatus = !areAllCompleted;

    const todosToUpdate = todoList.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingIds(currentIds => {
      const newPending = [...currentIds];

      todosToUpdate.forEach(todo => newPending.push(todo.id));

      return newPending;
    });

    setTodoList(currentTodos =>
      currentTodos.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );

    todosToUpdate.map(todo =>
      todoServices
        .updateTodo({ ...todo, completed: newStatus })
        .catch(() => setErrorMessage(ErrorMessages.updateError)),
    );

    setLoadingIds(currentIds =>
      currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
    );
  }, [areAllCompleted, todoList]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllCompleted={areAllCompleted}
          addPost={addPost}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          todoList={todoList}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          isLoading={isLoading}
          todoList={todoList}
          filteredTodos={filteredTodos}
          deleteTodos={deleteTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
          updatePost={updateTodo}
          inputRef={inputRef}
        />

        {todoList.length > 0 && (
          <Footer
            todoList={todoList}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            deleteTodos={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        removeError={() => setErrorMessage(ErrorMessages.default)}
      />
    </div>
  );
};

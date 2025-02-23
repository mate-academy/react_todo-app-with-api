/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as todoService from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filterValue, setFilterValue] = useState<Filter>(Filter.All);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const hideAllErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadingError);
        hideAllErrorMessage();
      });
  }, []);

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, todos, isSubmitting]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoadingTodoIds(currentTodoIds =>
          currentTodoIds.filter(id => id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodoError);
        setLoadingTodoIds(currentTodoIds =>
          currentTodoIds.filter(id => id !== todoId),
        );
        hideAllErrorMessage();
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setLoadingTodoIds(currentTodoIds => [...currentTodoIds, newTodo.userId]);

    setIsAdding(true);

    return todoService
      .postTodo(newTodo)
      .then(addingTodo => {
        setTodos(currentTodos => [...currentTodos, addingTodo]);
        setTodoTitle('');
        setLoadingTodoIds(currentBootTodos =>
          currentBootTodos.filter(id => id !== newTodo.userId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodoError);
        setLoadingTodoIds(currentBootTodos =>
          currentBootTodos.filter(id => id !== newTodo.userId),
        );
        hideAllErrorMessage();
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const updateTodo = (todoId: number, title: string, completed?: boolean) => {
    const todoForUpdate = todos.find(todo => todo.id === todoId);

    if (!todoForUpdate) {
      return;
    }

    const todoUpdate = {
      ...todoForUpdate,
      title: title.trim(),
      completed: completed ?? todoForUpdate.completed,
    };

    setLoadingTodoIds(currentBootTodos => [...currentBootTodos, todoId]);

    return todoService
      .updateTodo(todoId, todoUpdate)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? todoUpdate : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodoError);
        hideAllErrorMessage();
      })
      .finally(() => {
        setLoadingTodoIds(currentBootTodos =>
          currentBootTodos.filter(id => id !== todoId),
        );
      });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setErrorMessage(ErrorMessage.TitleError);
      hideAllErrorMessage();

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    addTodo({
      title,
      completed: false,
      userId: todoService.USER_ID,
    }).finally(() => setIsSubmitting(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <div className="todoapp__content">
          <Header
            todos={todos}
            todoTitle={todoTitle}
            setTodoTitle={setTodoTitle}
            formSubmit={handleFormSubmit}
            isAdding={isAdding}
            inputRef={inputRef}
            updateTodo={updateTodo}
          />
          <TodoList
            todos={filteredTodos}
            loadingTodoIds={loadingTodoIds}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            updateTodo={updateTodo}
          />

          {!!todos.length && (
            <Footer
              todos={todos}
              filterValue={filterValue}
              onClickFilter={setFilterValue}
              deleteTodo={deleteTodo}
            />
          )}
        </div>
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};

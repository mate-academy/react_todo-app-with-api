import React, { useState, useEffect, useRef } from 'react';

import {
  USER_ID,
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FiilterBy';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [changingIDs, setChangingIDs] = useState<number[]>([]);
  const [isEmptyTitleDelete, setIsEmptyTitleDelete] = useState(false);

  const handleEmptyTitleDelete = () => setIsEmptyTitleDelete(true);

  const handleClearingError = () => setErrorMessage(null);

  const handleChangingFilterBy = (value: FilterBy) => setFilterBy(value);

  const prepareToAction = (id: number) => {
    setErrorMessage(null);
    setChangingIDs(curIDs => [...curIDs, id]);
  };

  const visibleTodos = getFilteredTodos(todos, filterBy);

  const activeTodosCount: number = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo: boolean = todos.some(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    const normalizedTitle = titleText.trim();

    if (!normalizedTitle.trim()) {
      setErrorMessage(Errors.Empty);

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    prepareToAction(newTodo.id);

    createTodo(newTodo)
      .then(createdTodo => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitleText('');
      })
      .catch(() => {
        setErrorMessage(Errors.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== newTodo.id));
      });
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitleText(event.target.value);

  const handleDeletingTodo = (id: number) => {
    setErrorMessage(null);
    setChangingIDs(curIDs => [...curIDs, id]);

    return removeTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage(Errors.Delete);
        throw error;
      })
      .finally(() => {
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id));
        if (!isEmptyTitleDelete) {
          inputRef.current?.focus();
        }

        setIsEmptyTitleDelete(false);
      });
  };

  const handleClearingCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  const toggleTodo = (id: number, completed: boolean) => {
    prepareToAction(id);

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(Errors.Update))
      .finally(() =>
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id)),
      );
  };

  const toggleAllTodos = () => {
    if (activeTodosCount) {
      todos.forEach(todo => {
        if (!todo.completed) {
          toggleTodo(todo.id, todo.completed);
        }
      });
    } else {
      todos.forEach(todo => {
        toggleTodo(todo.id, todo.completed);
      });
    }
  };

  const handleRenameTodo = (id: number, title: string) => {
    prepareToAction(id);

    return updateTodo(id, { title })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.Update);
        throw error;
      })
      .finally(() =>
        setChangingIDs(curIDs => curIDs.filter(curID => curID !== id)),
      );
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          todos={todos}
          tempTodo={tempTodo}
          isDisabled={isDisabled}
          onSubmit={handleSubmit}
          titleText={titleText}
          onType={handleTyping}
          toggleAllTodos={toggleAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              changingIDs={changingIDs}
              onDelete={handleDeletingTodo}
              onToggle={toggleTodo}
              onRename={handleRenameTodo}
              onEmptyTitleDelete={handleEmptyTitleDelete}
            />

            <Footer
              onFilterByChoose={handleChangingFilterBy}
              activeTodosCount={activeTodosCount}
              onClearCompleted={handleClearingCompletedTodos}
              selectedFilterBy={filterBy}
              hasCompletedTodo={hasCompletedTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onDeleteError={handleClearingError}
      />
    </div>
  );
};

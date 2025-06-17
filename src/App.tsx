/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/enums';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todosToDisplay, setTodosToDisplay] = useState<Todo[]>([]);
  const [selectedValue, setSelectedValue] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isError, setIsError] = useState<ErrorType | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todosIds, setTodosIds] = useState<number[]>([]);
  const [isAllTodosNotComplited, setIsAllTodosNotComplited] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    getTodos()
      .then(setAllTodos)
      .catch(() => {
        setIsError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isError]);

  useEffect(() => {
    let viewList = allTodos;

    if (selectedValue === FilterStatus.Active) {
      viewList = viewList.filter(todo => !todo.completed);
    }

    if (selectedValue === FilterStatus.Completed) {
      viewList = viewList.filter(todo => todo.completed);
    }

    setTodosToDisplay(viewList);
  }, [selectedValue, allTodos]);

  useEffect(() => {
    if (
      allTodos.length ===
      allTodos.filter(todo => todo.completed === true).length
    ) {
      setIsAllTodosNotComplited(true);
    } else {
      setIsAllTodosNotComplited(false);
    }
  }, [allTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (newTitle: string) => {
    const newTempTodo: Todo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    addTodo(newTitle)
      .then(todoFromServer => {
        setAllTodos(prevTodos => [...prevTodos, todoFromServer]);
        setTempTodo(null);
        setIsError(null);
        setTitle('');
      })
      .catch(() => {
        setIsError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        inputRef.current?.focus();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setAllTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setIsError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
        inputRef.current?.focus();
      });
  };

  const handleError = (newError: ErrorType | null) => {
    setIsError(newError);
  };

  const handleDeleteCompleted = () => {
    const completedTodos = allTodos.filter(todo => todo.completed);

    completedTodos.map(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleCompleted = (
    id: number,
    todoTitle: string,
    completed: boolean,
  ) => {
    const updatedTodo = {
      id,
      title: todoTitle,
      completed: !completed,
      userId: USER_ID,
    };

    setTodosIds(prev => [...prev, id]);

    updateTodo(updatedTodo)
      .then(() => {
        setAllTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !completed } : todo,
          ),
        );
      })
      .catch(() => {
        setIsError('Unable to update a todo');
      })
      .finally(() => {
        setTodosIds(prev => prev.filter(ids => ids != id));
      });
  };

  const handleToggleAll = () => {
    const notComplided = allTodos.filter(todo => todo.completed === false);
    const complidedTodos = allTodos.filter(todo => todo.completed === true);

    if (notComplided.length === allTodos.length) {
      notComplided.map(todo =>
        handleToggleCompleted(todo.id, todo.title, todo.completed),
      );
    }

    if (complidedTodos.length === allTodos.length) {
      complidedTodos.map(todo =>
        handleToggleCompleted(todo.id, todo.title, todo.completed),
      );
    }

    if (notComplided.length > 0) {
      notComplided.map(todo =>
        handleToggleCompleted(todo.id, todo.title, todo.completed),
      );
    }
  };

  const handleTitleChange = (
    id: number,
    changeTitle: string,
    completed: boolean,
  ): Promise<boolean> => {
    const updatedTodo = {
      id,
      title: changeTitle,
      completed,
      userId: USER_ID,
    };

    setTodosIds(prev => [...prev, id]);

    return updateTodo(updatedTodo)
      .then(() => {
        setAllTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: changeTitle } : todo,
          ),
        );

        return false;
      })
      .catch(() => {
        setIsError('Unable to update a todo');

        return true;
      })
      .finally(() => {
        setTodosIds(prev => prev.filter(ids => ids != id));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleAddTodo={handleAddTodo}
          handleError={handleError}
          error={isError}
          tempTodo={tempTodo}
          title={title}
          onTitleChange={setTitle}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          isAllTodosNotComplited={isAllTodosNotComplited}
          allTodos={allTodos}
        />

        <TodoList
          allTodos={todosToDisplay}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
          onToggleCompleted={handleToggleCompleted}
          todosIds={todosIds}
          handleTitleChange={handleTitleChange}
        />

        {allTodos.length > 0 && (
          <Footer
            allTodos={allTodos}
            selectedValue={(value: FilterStatus) => setSelectedValue(value)}
            onSelect={selectedValue}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification error={isError} />
    </div>
  );
};

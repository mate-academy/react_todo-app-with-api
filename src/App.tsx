import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import { SORTFIELD } from './types/SortField';
import { ErrorTypes } from './types/ErrorType';
import { Processing } from './types/Processing';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isProcessing, setIsProcessing] = useState<Processing>({
    deleting: null,
    submitting: [],
  });

  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [sortField, setSortField] = useState<SORTFIELD>(SORTFIELD.ALL);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);

  const titleField = useRef<HTMLInputElement | null>(null);

  const errorMessageHandle = (newError: ErrorTypes | null) => {
    setErrorMessage(newError);
  };

  useEffect(() => {
    if (titleField) {
      titleField.current?.focus();
    }
  }, [titleField]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.getError);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    const doneTodos = todos.filter(todo => todo.completed);

    if (todos.length === doneTodos.length) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [todos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const createTodoHandle = (newTodo: Todo) => {
    const newTempTodo: Todo = {
      id: 0,
      title: newTodo.title,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    todoService
      .createTodo(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTempTodo(null);
        setErrorMessage(null);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.postError);
        setTempTodo(null);
      })
      .finally(() => {
        titleField.current?.focus();
      });
  };

  const deleteTodoHandle = (todoId: number) => {
    setIsProcessing(prev => ({ ...prev, deleting: todoId }));

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.deleteError);
      })
      .finally(() => {
        setIsProcessing(prev => ({ ...prev, deleting: null }));
        titleField.current?.focus();
      });
  };

  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsProcessing(prev => ({
      ...prev,
      submitting: [...prev.submitting, ...completedTodos.map(t => t.id)],
    }));

    Promise.all(completedTodos.map(todo => deleteTodoHandle(todo.id)))
      .then(() => {})
      .catch(() => {
        setErrorMessage(ErrorTypes.deleteError);
      });
  };

  const renameTodoHandle = (updatingTodo: Todo) => {
    const updatedTodo = {
      id: updatingTodo.id,
      title: updatingTodo.title,
      completed: updatingTodo.completed,
      userId: todoService.USER_ID,
    };

    setIsProcessing(prev => ({
      ...prev,
      submitting: [...prev.submitting, updatingTodo.id],
    }));

    return todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatingTodo.id
              ? { ...todo, title: updatingTodo.title }
              : todo,
          ),
        );

        return false;
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.patchError);

        return true;
      })
      .finally(() => {
        setIsProcessing(prev => ({
          ...prev,
          submitting: [...prev.submitting.filter(i => i !== updatingTodo.id)],
        }));
      });
  };

  const singleToggleHandle = (
    id: number,
    todoTitle: string,
    completed: boolean,
  ) => {
    const updatedTodo = {
      id,
      title: todoTitle,
      completed: !completed,
      userId: todoService.USER_ID,
    };

    setIsProcessing(prev => ({
      ...prev,
      submitting: [...prev.submitting, id],
    }));

    todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.patchError);
      })
      .finally(() => {
        setIsProcessing(prev => ({
          ...prev,
          submitting: [...prev.submitting.filter(i => i !== id)],
        }));
      });
  };

  const multiToggleHandle = () => {
    const notComplided = todos.filter(todo => todo.completed === false);
    const complidedTodos = todos.filter(todo => todo.completed === true);

    if (notComplided.length === todos.length) {
      notComplided.map(todo =>
        singleToggleHandle(todo.id, todo.title, todo.completed),
      );
    }

    if (complidedTodos.length === todos.length) {
      complidedTodos.map(todo =>
        singleToggleHandle(todo.id, todo.title, todo.completed),
      );
    }

    if (notComplided.length > 0) {
      notComplided.map(todo =>
        singleToggleHandle(todo.id, todo.title, todo.completed),
      );
    }
  };

  const visibleTodos = (items: Todo[], sortType: SORTFIELD) => {
    let visibleItems = [...items];

    if (sortType === SORTFIELD.ACTIVE) {
      visibleItems = visibleItems.filter(t => !t.completed);
    } else if (sortType === SORTFIELD.COMPLETED) {
      visibleItems = visibleItems.filter(t => t.completed);
    }

    return visibleItems;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          title={title}
          setTitle={setTitle}
          createTodoHandle={createTodoHandle}
          errorMessageHandle={errorMessageHandle}
          multiToggleHandle={multiToggleHandle}
          isActive={isActive}
          titleField={titleField}
        />

        <TodoList
          todos={visibleTodos(todos, sortField)}
          tempTodo={tempTodo}
          deleteTodoHandle={deleteTodoHandle}
          isProcessing={isProcessing}
          singleToggleHandle={singleToggleHandle}
          renameTodoHandle={renameTodoHandle}
        />

        {todos.length > 0 && (
          <Footer
            sortField={sortField}
            setSortField={setSortField}
            todos={todos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};

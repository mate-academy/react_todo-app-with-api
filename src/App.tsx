import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import {
  getTodos,
  postTodo,
  removeTodo,
  changeTodoStatus,
  changeTodoTitle,
} from './api/todos';

import { Todo } from './types/Todo';
import { User } from './types/User';

import { FilterTypes } from './types/FilterTypes';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterType, setFilterType] = useState<string>(FilterTypes.All);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');

  const [changeTitle, setChangeTitle] = useState('');

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  const [isDisabled, setIsDisabled] = useState(false);

  const [doubleClickTodoId, setDoubleClickTodoId]
    = useState<number | null>(null);

  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const changeStatusTodo = (todoId: number, status: boolean) => {
    setSelectedTodoId(todoId);
    changeTodoStatus(todoId, !status)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, completed: !status };
            }

            return todo;
          })
        ));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.RewriteFail);
      }).finally(() => {
        setSelectedTodoId(null);
      });
  };

  const isDoubleClicked = (todoId: number | null, titleTodo: string) => {
    setChangeTitle(titleTodo);
    setDoubleClickTodoId(todoId);
  };

  const changeTitleTodo = (
    todoId: number,
    todoTitle: string,
    event: React.FocusEvent<HTMLInputElement> | null,
  ) => {
    const todoOnChange = todos.find(todo => todo.id === todoId);

    if (event?.target) {
      setDoubleClickTodoId(null);
    }

    if (todoOnChange?.title === todoTitle) {
      return;
    }

    setDoubleClickTodoId(null);

    setSelectedTodoId(todoId);

    changeTodoTitle(todoId, todoTitle)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, title: todoTitle };
            }

            return todo;
          })
        ));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.RewriteFail);
      })
      .finally(() => {
        setSelectedTodoId(null);
        setDoubleClickTodoId(null);
      });
  };

  const onKeyDownTitleTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
    todoTitle: string,
  ) => {
    if (event.key === 'Escape') {
      isDoubleClicked(null, todoTitle);
    }

    if (event.key === 'Enter') {
      setDoubleClickTodoId(null);
      changeTitleTodo(todoId, todoTitle, null);
    }
  };

  const changeStatusAll = async () => {
    const allStatus = todos.some(todo => todo.completed === false);

    const todosIds = todos
      .filter(todoStatus => todoStatus.completed !== allStatus)
      .map(todo => todo.id);

    setCompletedTodos(todosIds);

    try {
      await Promise.all(todosIds.map(async (todoId) => {
        await changeTodoStatus(todoId, allStatus);

        setTodos(prevTodos => (
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              return {
                ...todo,
                completed: allStatus,
              };
            }

            return todo;
          })
        ));
      }));
    } catch {
      setError(true);
      setErrorMessage(ErrorMessage.RewriteFail);
    } finally {
      setCompletedTodos([]);
    }
  };

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.All:
        return todo;

      case FilterTypes.Active:
        return !todo.completed && FilterTypes.Active;

      case FilterTypes.Completed:
        return todo.completed && FilterTypes.Completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    getTodos(user?.id || 0).then(response => {
      setTodos(response);
    }).catch(() => {
      setErrorMessage(ErrorMessage.LoadFail);
      setError(true);
    });
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDisabled]);

  const handleFilterType = (type: string) => {
    setFilterType(type);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTitle('');
      setError(true);

      return;
    }

    setIsDisabled(true);

    const copyTodos = [...todos];

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    setSelectedTodoId(0);

    postTodo(user?.id || 0, title)
      .then(newTodo => {
        setIsDisabled(false);
        setTodos([...copyTodos, newTodo]);
      })
      .catch(() => {
        setError(true);
        setIsDisabled(false);
        setErrorMessage(ErrorMessage.AddFail);

        setTodos((prev) => {
          return prev.filter(oneTodo => {
            return oneTodo.id !== 0;
          });
        });
      })
      .finally(() => {
        setSelectedTodoId(0);
        setTitle('');
      });
  };

  const removeError = (boolean: boolean) => {
    setError(boolean);
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    removeTodo(todoId)
      .then(() => {
        setSelectedTodoId(todoId);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.DeleteFail);
      })
      .finally(() => {
        setSelectedTodoId(null);
      });
  };

  const clearTable = async () => {
    const filterTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodos(filterTodos);

    try {
      await Promise.all(filterTodos.map(async (todoId) => {
        await removeTodo(todoId);

        setTodos(prevTodos => prevTodos
          .filter(todo => {
            return todo.id !== todoId;
          }));
      }));
    } catch {
      setError(true);
      setErrorMessage(ErrorMessage.DeleteFail);
    } finally {
      setCompletedTodos([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          setTitle={setTitle}
          isDisabled={isDisabled}
          title={title}
          changeStatusAll={changeStatusAll}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
          selectedTodoId={selectedTodoId}
          completedTodos={completedTodos}
          isDoubleClicked={isDoubleClicked}
          doubleClickTodoId={doubleClickTodoId}
          changeTitle={changeTitle}
          setChangeTitle={setChangeTitle}
          changeStatusTodo={changeStatusTodo}
          changeTitleTodo={changeTitleTodo}
          onKeyDownTitleTodo={onKeyDownTitleTodo}
        />
        <Footer
          clearTable={clearTable}
          handleFilterType={handleFilterType}
          filterType={filterType}
          filteredTodos={filteredTodos}
        />

      </div>

      <ErrorNotification
        error={error}
        removeError={removeError}
        errorMessage={errorMessage}
      />
    </div>
  );
};

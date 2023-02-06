import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
// import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes, FilterTypes } from './types/Enums';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [filterType, setFilterType] = useState('All');
  // const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [isToggledAll, setIsToggledAll] = useState(false);
  const [todosToUpdate, setTodosToUpdate] = useState<Todo[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setIsError(true);
          setErrorMessage(ErrorTypes.UnableToLoad);
        });
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [user]);

  const handleButtonClickAll = () => {
    setFilterType(FilterTypes.All);
  };

  const handleButtonClickActive = () => {
    setFilterType(FilterTypes.ACTIVE);
  };

  const handleButtonClickCompleted = () => {
    setFilterType(FilterTypes.COMPLETED);
  };

  // const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!todoTitle.trim()) {
  //     setErrorMessage(ErrorTypes.EmptyTitle);
  //     setTodoTitle('');

  //     return;
  //   }

  //   setIsLoading(true);

  //   if (user) {
  //     setTempTodo({
  //       id: 0,
  //       title: todoTitle,
  //       completed: false,
  //       userId: user.id,
  //     });

  //     addTodo(todoTitle, user.id)
  //       .then(response => {
  //         setTodos(prev => [...prev, {
  //           id: response.id,
  //           title: response.title,
  //           completed: response.completed,
  //           userId: response.userId,
  //         }]);
  //       })
  //       .catch(() => setErrorMessage(ErrorTypes.UnableToAdd))
  //       .finally(() => {
  //         setIsLoading(false);
  //         setTempTodo(null);
  //         setTodoTitle('');
  //       });
  //   }
  // }, [todoTitle, user]);

  const addNewTodo = useCallback(async (newTitle: string) => {
    if (!newTitle.trim()) {
      setIsError(true);
      setErrorMessage(ErrorTypes.EmptyTitle);

      return;
    }

    setIsLoading(true);

    if (user) {
      try {
        setTempTodo({
          id: 0,
          title: newTitle.trim(),
          completed: false,
          userId: user.id,
        });

        const newTodo = await addTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(prev => [...prev, newTodo]);
        setErrorMessage('');
        setIsError(false);
      } catch (error) {
        setIsError(true);
        setErrorMessage(ErrorTypes.UnableToAdd);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
      }
    }
  }, [user]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodosIds(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setErrorMessage('');
      setIsError(false);
    } catch (error) {
      setErrorMessage('todo is not delete');
      setIsError(true);
    } finally {
      setDeletingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const deleteCompleated = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  const onUpdateTodo = (chosenTodo: Todo) => {
    setTodosToUpdate(prev => [...prev, chosenTodo]);

    updateTodo(chosenTodo.id, chosenTodo.title, chosenTodo.completed)
      .then((udpatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id !== udpatedTodo.id
            ? todo
            : {
              id: udpatedTodo.id,
              userId: udpatedTodo.userId,
              title: udpatedTodo.title,
              completed: udpatedTodo.completed,
            }
        )));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UnableToUpdate);
      })
      .finally(() => {
        setTodosToUpdate([]);
      });
  };

  const onToggleAll = () => {
    setIsLoading(true);
    if (isToggledAll === false) {
      todos.forEach(todo => {
        if (!todo.completed) {
          onUpdateTodo({ ...todo, completed: !todo.completed });
        }
      });
      setIsToggledAll(true);
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: !todo.completed });
      });
      setIsToggledAll(false);
    }

    setIsLoading(false);
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      case FilterTypes.All:
        return todos;

      default:
        throw new Error('Invalid sorting type');
    }
  }, [todos, filterType]);

  if (isError) {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }

  const handleCloseErrorMessage = () => {
    setIsError(false);
  };

  const incompletedTodos = visibleTodos.filter(todo => !todo.completed);
  const completedTodosAmount = visibleTodos
    .filter(todo => todo.completed).length;
  const toggledAlltodos = visibleTodos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isLoading={isLoading}
          onAddTodo={addNewTodo}
          onToggleAll={onToggleAll}
          toggledAlltodos={toggledAlltodos}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              isLoading={isLoading}
              deletingTodosIds={deletingTodosIds}
              onUpdateTodo={onUpdateTodo}
              todosToUpdate={todosToUpdate}
            />

            {/* {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                isLoading={isLoading}
                isDeleting={deletingTodosIds.includes(tempTodo.id)}
                onDeleteTodo={onDeleteTodo}
                onUpdateTodo={onUpdateTodo}
                isUpdating={false}
              />
            )} */}

            <Footer
              filterType={filterType}
              incompletedTodos={incompletedTodos}
              handleButtonClickAll={handleButtonClickAll}
              handleButtonClickActive={handleButtonClickActive}
              handleButtonClickCompleted={handleButtonClickCompleted}
              completedTodosAmount={completedTodosAmount}
              deleteCompleated={deleteCompleated}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isError={isError}
          onCloseErrorMessage={handleCloseErrorMessage}
        />
      )}
    </div>
  );
};

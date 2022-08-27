import React, {
  useCallback,
  useContext,
  useEffect, useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  addTodo,
  changeTodo,
  getTodos, removeTodo,
} from './api/todos';
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm';
import { Footer } from './components/Footer/Footer';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllTodoDone, setIsAllTodoDone] = useState(false);
  const [sortType, setSortType] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAllCheckedLoading, setIsAllCheckedLoading] = useState(false);

  const activeTodosQty = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isAllDeleteButtonActive
    = useMemo(() => todos.some(todo => todo.completed), [todos]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getTodos(user.id)
        .then(setTodos)
        .catch((msg) => setErrorMessage(msg))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const onAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => (
      [...prevTodos, todo]
    ));
  };

  const handlerAddTodo = useCallback((title: string) => {
    if (user && title) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      addTodo(newTodo)
        .then(addedTodo => onAddTodo(addedTodo))
        .catch(() => setErrorMessage('Unable to add a todo'));
    } else if (!title) {
      setErrorMessage('Title can\'t be empty');
    }
  }, [user]);

  const onTodosUpdate = useCallback((changedTodo: Todo) => {
    const newTodoList = [...todos].map(todo => {
      if (todo.id === changedTodo.id) {
        return changedTodo;
      }

      return todo;
    });

    setTodos(newTodoList);
  }, [todos]);

  const handlerTodoStatusToggle = useCallback((id: number, status: boolean) => {
    setIsLoading(true);
    changeTodo(id, { completed: !status })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  }, [onTodosUpdate]);

  const handlerTodoTitleUpdate = useCallback((id: number, title: string) => {
    setIsLoading(true);
    changeTodo(id, { title })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  }, [onTodosUpdate]);

  const onDeleteTodo = (deletedTodoId: number) => {
    setTodos((prev) => prev.filter(todo => todo.id !== deletedTodoId));
  };

  const handlerDeleteTodo = useCallback((todoId:number) => {
    setIsLoading(true);
    removeTodo(todoId)
      .then((res) => {
        if (res === 1) {
          onDeleteTodo(todoId);
        } else {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsAllCheckedLoading(false);
      });
  }, []);

  const allTodoStatusToggle = useCallback(() => {
    setIsLoading(true);
    setIsAllCheckedLoading(true);
    const newTodoList = [...todos].map(todo => {
      changeTodo(todo.id, { completed: !isAllTodoDone })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setIsLoading(false);
          setIsAllCheckedLoading(false);
        });

      return {
        ...todo,
        completed: !isAllTodoDone,
      };
    });

    setTodos(newTodoList);
    setIsAllTodoDone((prev) => !prev);
  }, [isAllTodoDone, todos]);

  const delAllCompletedTodoHandler = useCallback(() => {
    setIsAllCheckedLoading(true);

    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  }, [handlerDeleteTodo, todos]);

  const prepareTodos = () => {
    if (sortType === null) {
      return todos;
    }

    return [...todos].filter(todo => todo.completed === sortType);
  };

  const preparedTodos = prepareTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={allTodoStatusToggle}
          />

          <AddTodoForm addNewTodo={handlerAddTodo} />
        </header>

        <TodoList
          todos={preparedTodos}
          changeTodoStatus={handlerTodoStatusToggle}
          isLoading={isLoading}
          deleteTodo={handlerDeleteTodo}
          updateTitle={handlerTodoTitleUpdate}
          isAllCheckedLoading={isAllCheckedLoading}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosQty={activeTodosQty}
            setSortType={setSortType}
            clearBtnActive={isAllDeleteButtonActive}
            deleteCompletedTodos={delAllCompletedTodoHandler}
          />
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

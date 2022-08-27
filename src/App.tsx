import React, {
  useContext,
  useEffect,
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

  const activeTodosQty = todos.filter(todo => !todo.completed).length;
  const isAllDeleteButtonActive = todos.some(todo => todo.completed);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getTodos(user.id)
        .then(setTodos)
        .catch((msg) => setErrorMessage(msg))
        .finally(() => setIsLoading(false));
    }
  }, []);

  // eslint-disable-next-line no-console
  console.log(todos);

  const onAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => (
      [...prevTodos, todo]
    ));
  };

  const handlerAddTodo = (title: string) => {
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
  };

  const onTodosUpdate = (changedTodo: Todo) => {
    const newTodoList = [...todos].map(todo => {
      if (todo.id === changedTodo.id) {
        return changedTodo;
      }

      return todo;
    });

    setTodos(newTodoList);
  };

  const handlerTodoStatusToggle = (id: number, status: boolean) => {
    setIsLoading(true);
    changeTodo(id, { completed: !status })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerTodoTitleUpdate = (id: number, title: string) => {
    setIsLoading(true);
    changeTodo(id, { title })
      .then(changedTodo => onTodosUpdate(changedTodo))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDeleteTodo = (deletedTodoId: number) => {
    setTodos((prev) => prev.filter(todo => todo.id !== deletedTodoId));
  };

  const handlerDeleteTodo = (todoId:number) => {
    setIsLoading(true);
    removeTodo(todoId)
      .then((res) => {
        console.log(res)
        if (res === 1) {
          onDeleteTodo(todoId);
        } else {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const allTodoStatusToggle = () => {
    const newTodoList = [...todos].map(todo => {
      changeTodo(todo.id, { completed: !isAllTodoDone })
        .catch(() => setErrorMessage('Unable to update a todo'));

      return {
        ...todo,
        completed: !isAllTodoDone,
      };
    });

    setTodos(newTodoList);
    setIsAllTodoDone((prev) => !prev);
  };

  const delAllCompletedTodo = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  };

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
        />

        {todos.length > 0 && (
          <Footer
            activeTodosQty={activeTodosQty}
            setSortType={setSortType}
            clearBtnActive={isAllDeleteButtonActive}
            deleteCompletedTodos={delAllCompletedTodo}
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

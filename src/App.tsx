import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { deleteTodo, getTodos, patchTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [isErrorShow, setIsErrorShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<number[]>([]);
  const [isAllCompletedChecked, setIsAllCompletedChecked] = useState(false);

  const handleError = () => {
    setIsErrorShow(true);

    setTimeout(() => {
      setIsErrorShow(false);
    }, 3000);
  };

  const updateErrorMessage = (message: string) => {
    handleError();
    setErrorMessage(message);
  };

  const handleAllCompleted = (array: Todo[]) => {
    if (array.some(todo => !todo.completed) || array.length === 0) {
      setIsAllCompletedChecked(false);
    } else {
      setIsAllCompletedChecked(true);
    }
  };

  const loadingTodos = async () => {
    if (user) {
      try {
        setIsErrorShow(false);

        const todosFromServer = await getTodos(user.id);

        handleAllCompleted(todosFromServer);

        setTodos(todosFromServer);
      } catch (error) {
        handleError();
        setTodos([]);
      }
    }
  };

  const showFilteredTodos = (array: Todo[]) => {
    setCurrentTodos(array);
  };

  const addTodo = (todo: Todo) => {
    const newArray = [...todos, todo];

    setTodos(newArray);
  };

  const showTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const removeTodo = (todoIds: number[]) => {
    const newArray = todos.filter(todo => !todoIds.includes(todo.id));

    setTodos(newArray);
  };

  const onTodoDelete = async (todoIds: number[]) => {
    try {
      setIsProcessing(true);
      setCurrentTodoId(todoIds);

      await Promise.all(
        todoIds.map(todoId => deleteTodo(todoId)),
      );

      removeTodo(todoIds);
      setIsProcessing(false);
      setIsAllCompletedChecked(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      handleError();
      setIsProcessing(false);
    }
  };

  const toggleCompletedStatus = async (
    todoIds: number[],
    data: Pick<Todo, 'completed'>,
  ) => {
    try {
      setIsProcessing(true);
      setCurrentTodoId(todoIds);

      await Promise.all(todoIds.map(todoId => patchTodo(todoId, data)));

      const updatedArray = todos.map(todo => {
        if (todoIds.includes(todo.id)) {
          return {
            ...todo,
            completed: data.completed,
          };
        }

        return todo;
      });

      setTodos(updatedArray);
      handleAllCompleted(updatedArray);
      setIsProcessing(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      handleError();
      setIsProcessing(false);
    }
  };

  const toggleAllCompletedStatus = () => {
    const todoIds = isAllCompletedChecked
      ? todos.map(todo => todo.id)
      : todos.filter(todo => !todo.completed).map(todo => todo.id);

    toggleCompletedStatus(todoIds, { completed: !isAllCompletedChecked });
  };

  const handleTitleChanges = async (
    todoId: number,
    data: Pick<Todo, 'title'>,
  ) => {
    try {
      setIsProcessing(true);
      setCurrentTodoId([todoId]);

      await patchTodo(todoId, data);

      const updatedArray = todos.map(todo => {
        if (todoId === todo.id) {
          return {
            ...todo,
            title: data.title,
          };
        }

        return todo;
      });

      setTodos(updatedArray);
      setIsProcessing(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      handleError();
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={updateErrorMessage}
          addTodo={addTodo}
          showTempTodo={showTempTodo}
          handleError={handleError}
          toggleAllCompletedStatus={toggleAllCompletedStatus}
          isAllCompletedChecked={isAllCompletedChecked}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={currentTodos}
              tempTodo={tempTodo}
              onTodoDelete={onTodoDelete}
              isProcessing={isProcessing}
              currentTodoId={currentTodoId}
              toggleCompletedStatus={toggleCompletedStatus}
              handleTitleChanges={handleTitleChanges}
            />

            <Footer
              todos={todos}
              showFilteredTodos={showFilteredTodos}
              onTodoDelete={onTodoDelete}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isErrorShow },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="HideErrorButton"
          onClick={() => {
            setIsErrorShow(false);
          }}
        />

        {errorMessage}
      </div>
    </div>
  );
};

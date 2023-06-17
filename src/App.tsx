/* eslint-disable no-console */
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo, SortType } from './Types';
import { UserWarning } from './UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';
import { Error } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const USER_ID = 10377;

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [apiResponseReceived, setApiResponseReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);
  const [isHidden, setIsHidden] = useState('');
  const [placeHolderText, setPlaceHolderText] = useState('');
  const [isDoubleClickedName, setIsDoubleClickedName] = useState('');
  const [isThereIssue, setIsThereIssue] = useState(false);
  const [numberOfActiveTodos, setNumberOfActivTodos] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState('');
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState('');
  const [isEveryThingDelete, setIsEveryThingDelete] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isPlusOne, setIsPlusOne] = useState(false);
  const [isEveryThingTrue, setIsEveryThingTrue] = useState(false);
  const [toggleFalseTodosId, setToggleFalseTodosId] = useState([0]);
  const [todoStatusChange, setTodoStatusChange] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const excludedInputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      setIsHidden('Unable to add a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      console.log('Unable to add a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTempTodo = (value: string) => {
    setInputValue(value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsThereIssue(false);
    setIsLoading(true);
    setIsPlusOne(true);

    setTempTodo({
      ...tempTodo,
      title: inputValue.trim(),
      id: 0,
      completed: false,
      userId: USER_ID,
    });

    if (inputValue.trim() !== '') {
      const tempTodoItem: Todo = {
        title: inputValue.trim(),
        userId: USER_ID,
        completed: false,
        id: getRandomNumber(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodos((prevTodo) => [...prevTodo, tempTodoItem]);
        setApiResponseReceived(true);
      } catch (error) {
        setIsThereIssue(true);
        setDeleteErrorMessage('Unable to add the todo');
        timeoutId.current = setTimeout(() => {
          setIsThereIssue(false);
        }, 3000);
        setIsPlusOne(false);
      } finally {
        setApiResponseReceived(false);
        setIsLoading(false);
        setIsPlusOne(false);
      }
    } else {
      setIsThereIssue(true);
      setIsPlusOne(false);
      setIsTitleEmpty('Title can\'t be empty');
    }

    setInputValue('');
  };

  const deleteTodo = async (id: number) => {
    setDeletedTodoId(id);

    try {
      setIsLoading(true);
      await client.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setDeleteErrorMessage('Unable to delete the todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
      setIsLoading(false);
      console.log('Unable to delete the todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllTodo = async () => {
    setTodoStatusChange(true);

    const everyCompleted = todos.every((item) => item.completed);

    if (everyCompleted) {
      setIsEveryThingTrue(true);
    }

    const updatedTodos = todos.map((element) => {
      if (!everyCompleted && element.completed === false) {
        setToggleFalseTodosId(prevState => [...prevState, element.id]);
      }

      return everyCompleted
        ? { ...element, completed: !element.completed }
        : { ...element, completed: true };
    });

    setTodos(updatedTodos);

    try {
      await Promise.all(
        updatedTodos.map(async (todoItem) => {
          await client.patch(`/todos/${todoItem.id}`, {
            ...todoItem,
            completed: todoItem.completed,
          });
        }),
      );
    } catch (error) {
      console.log('There is an issue updating todos.', error);
    }

    setToggleFalseTodosId([]);
    setIsEveryThingTrue(false);
    setTodoStatusChange(false);
  };

  const updateIndividualTodo = async (id: number) => {
    setUpdatingTodoId(id);
    const updatedTodo = todos.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    const none = todos.some((element) => {
      return element.id === id;
    });

    if (!none) {
      setEditTodo('Unable to update a todo');
      setIsThereIssue(true);
    }

    setTodos(updatedTodo);

    try {
      const todoToUpdate = todos.find((elem) => elem.id === id);

      if (todoToUpdate) {
        setIsLoading(true);

        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });

        setIsLoading(false);
        setUpdatingTodoId(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to update a todo');
      setIsHidden('Unable to update a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchTodos();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    const isActive = todos.some((obj) => obj.completed === false);
    const isFalse = todos.some((obj) => obj.completed === true);
    const todoLength = todos.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isFalse);
    setNumberOfActivTodos(todoLength.length);
  }, [todos]);

  const visibleTodos: Todo[] = useMemo(() => todos.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
      default:
        return todos;
    }
  }), [todos, selectedTab]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            isThereActiveTodo={isThereActiveTodo}
            inputValue={inputValue}
            apiResponseReceived={apiResponseReceived}
            updateAllTodo={updateAllTodo}
            updateTempTodo={updateTempTodo}
            handleFormSubmit={handleFormSubmit}
          />
          <TodoList
            todo={todos}
            visibleTodos={visibleTodos}
            isLoading={isLoading}
            updatingTodoId={updatingTodoId}
            tempTodo={tempTodo}
            updateIndividualTodo={updateIndividualTodo}
            isDoubleClickedName={isDoubleClickedName}
            placeHolderText={placeHolderText}
            setPlaceHolderText={setPlaceHolderText}
            excludedInputRef={excludedInputRef}
            isUpdating={isUpdating}
            setIsDoubleClickedName={setIsDoubleClickedName}
            deleteTodo={deleteTodo}
            setIsUpdating={setIsUpdating}
            setTodos={setTodos}
            isPlusOne={isPlusOne}
            isThereIssue={isThereIssue}
            setIsThereIssue={setIsThereIssue}
            deletedTodoId={deletedTodoId}
            isEveryThingDelete={isEveryThingDelete}
            todoStatusChange={todoStatusChange}
            toggleFalseTodosId={toggleFalseTodosId}
            isEveryThingTrue={isEveryThingTrue}
            setDeleteErrorMessage={setDeleteErrorMessage}
          />
          {todos.length > 0 && (
            <Footer
              numberOfActiveTodos={numberOfActiveTodos}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isThereCompletedTodos={isThereCompletedTodos}
              todo={todos}
              setIsEveryThingDelete={setIsEveryThingDelete}
              setTodos={setTodos}
              setDeleteErrorMessage={setDeleteErrorMessage}
            />
          )}

        </div>

        <Error
          message={isHidden}
          deleteErrorMessage={deleteErrorMessage}
          isThereIssue={isThereIssue}
          editTodo={editTodo}
          setIsThereIssue={setIsThereIssue}
          isTitleEmpty={isTitleEmpty}
        />
      </div>
    </>
  );
};

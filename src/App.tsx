import { nanoid } from 'nanoid';
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo, SortType } from './Types';
import { UserWarning } from './components/UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';
import { ErrorMessages } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const USER_ID = 10377;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [apiResponseReceived, setApiResponseReceived] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isHidden, setIsHidden] = useState('');
  const [isThereIssue, setIsThereIssue] = useState(false);
  const [numberOfActiveTodos, setNumberOfActivTodos] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState('');
  const [isEveryThingDelete, setIsEverythingDeleted] = useState(false);
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isPlusOne, setIsPlusOne] = useState(false);
  const [isEveryThingTrue, setIsEveryThingTrue] = useState(false);
  const [toggleFalseTodosId, setToggleFalseTodosId] = useState([0]);
  const [todoStatusChange, setTodoStatusChange] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setIsHidden('Unable to add a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
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
        id: +nanoid(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodos((prevTodo) => [...prevTodo, tempTodoItem]);
        setApiResponseReceived(false);
      } catch (error) {
        setIsThereIssue(true);
        setDeleteErrorMessage('Unable to add the todo');
        timeoutId.current = setTimeout(() => {
          setIsThereIssue(false);
        }, 3000);
        setIsPlusOne(false);
      } finally {
        setApiResponseReceived(true);
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
    } finally {
      setIsLoading(false);
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

  const isActive = useMemo(() => todos.some((obj) => {
    return obj.completed === false;
  }), [todos]);
  const isFalse = useMemo(() => todos.some((obj) => {
    return obj.completed === true;
  }), [todos]);
  const todoLength = useMemo(() => todos.filter((obj) => {
    return obj.completed === false;
  }).length, [todos]);

  useEffect(() => {
    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isFalse);
    setNumberOfActivTodos(todoLength);
  }, [isActive, isFalse, todoLength]);

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
            setIsEveryThingTrue={setIsEveryThingTrue}
            setToggleFalseTodosId={setToggleFalseTodosId}
            setTodoStatusChange={setTodoStatusChange}
            updateTempTodo={updateTempTodo}
            handleFormSubmit={handleFormSubmit}
            todos={todos}
            setTodos={setTodos}
            setDeleteErrorMessage={setDeleteErrorMessage}
            setIsThereIssue={setIsThereIssue}
            setIsLoading={setIsLoading}
          />
          <TodoList
            todos={todos}
            visibleTodos={visibleTodos}
            isLoading={isLoading}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
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
            setIsLoading={setIsLoading}
            setIsHidden={setIsHidden}
          />
          {todos.length > 0 && (
            <Footer
              numberOfActiveTodos={numberOfActiveTodos}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isThereCompletedTodos={isThereCompletedTodos}
              todos={todos}
              setIsEverythingDeleted={setIsEverythingDeleted}
              setTodos={setTodos}
              setDeleteErrorMessage={setDeleteErrorMessage}
            />
          )}
        </div>

        <ErrorMessages
          message={isHidden}
          deleteErrorMessage={deleteErrorMessage}
          isThereIssue={isThereIssue}
          setIsThereIssue={setIsThereIssue}
          isTitleEmpty={isTitleEmpty}
        />
      </div>
    </>
  );
};

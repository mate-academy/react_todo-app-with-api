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

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
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
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState('');
  const [tempTodo, setTempTodo] = useState({
    title: '',
    userId: USER_ID,
    completed: false,
    id: 0,
  });
  const excludedInputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodo(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Unable to add a todo');
      setIsHidden('Unable to add a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    const tempTodos = todo.filter((element) => {
      return element.id !== id;
    });

    setTodo(tempTodos);

    try {
      await client.delete(`/todos/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('There is an issue.', error);
      setDeleteErrorMessage('Unable to delete a todo');
    }
  };

  const updateIndividualTodo = async (id: number) => {
    setUpdatingTodoId(id);
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    const none = todo.some((element) => {
      return element.id === id;
    });

    if (!none) {
      setEditTodo('Unable to update a todo');
      setIsThereIssue(true);
    }

    setTodo(updatedTodo);

    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

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
    const isActive = todo.some((obj) => obj.completed === false);
    const isFalse = todo.some((obj) => obj.completed === true);
    const todoLength = todo.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isFalse);
    setNumberOfActivTodos(todoLength.length);
  }, [todo]);

  const visibleTodos: Todo[] = useMemo(() => todo.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
        return todo;
      default:
        return todo;
    }
  }), [todo, selectedTab]);

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
            setInputValue={setInputValue}
            inputValue={inputValue}
            todo={todo}
            setTodo={setTodo}
            setTempTodo={setTempTodo}
            tempTodo={tempTodo}
            USER_ID={USER_ID}
            setIsLoading={setIsLoading}
          />
          <TodoList
            todo={todo}
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
            setTodo={setTodo}
          />
          {todo.length > 0 && (
            <Footer
              numberOfActiveTodos={numberOfActiveTodos}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isThereCompletedTodos={isThereCompletedTodos}
              todo={todo}
              setTodo={setTodo}
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
        />
      </div>
    </>
  );
};

import React, {
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Filter } from './services/enums';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types';

const USER_ID = 11138;

interface FilterParams {
  filterBy?: Filter,
}

function filterTodosByCompleted(todos: Todo[], filter: Filter): Todo[] {
  let todosCopy = [...todos];

  switch (filter) {
    case (Filter.ACTIVE): {
      todosCopy = todosCopy.filter(todo => !todo.completed);
      break;
    }

    case (Filter.COMPLETED): {
      todosCopy = todosCopy.filter(todo => todo.completed);
      break;
    }

    default: {
      break;
    }
  }

  return todosCopy;
}

function filterTodos(todos: Todo[], { filterBy }: FilterParams): Todo[] {
  let todosCopy = [...todos];

  if (filterBy) {
    todosCopy = filterTodosByCompleted(todos, filterBy);
  }

  return todosCopy;
}

function deleteAllTodos(todosIds: number[]) {
  const promiseArray = todosIds.map(id => deleteTodo(id));

  return Promise.all(promiseArray);
}

function changeTodoStatusTo(todos: Todo[], newStatus: boolean) {
  const todosToOperate = todos.filter(todo => todo.completed !== newStatus);
  const promiseArray = todosToOperate.map(todo => {
    const newTodo: Todo = {
      ...todo,
      completed: newStatus,
    };

    return updateTodo(newTodo);
  });

  return Promise.all(promiseArray);
}

interface DataContextProps {
  todos: Todo[],
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  visibleTodos: Todo[],
  filterBy: Filter,
  setFilterBy: React.Dispatch<SetStateAction<Filter>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<SetStateAction<string>>,
  areCompletedDeletingNow: boolean,
  setAreCompletedDeletingNow: React.Dispatch<SetStateAction<boolean>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
  todosIdsOnOperating: number[],
  setTodosIdsOnOperating: React.Dispatch<SetStateAction<number[]>>,
  toggleToStatus: boolean | null,
  setToggleToStatus: React.Dispatch<SetStateAction<boolean | null>>,
}

const TodosDataContext = React.createContext<DataContextProps>({
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  filterBy: Filter.ALL,
  setFilterBy: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  areCompletedDeletingNow: false,
  setAreCompletedDeletingNow: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosIdsOnOperating: [],
  setTodosIdsOnOperating: () => {},
  toggleToStatus: null,
  setToggleToStatus: () => {},
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataProviderProps> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [areCompletedDeletingNow, setAreCompletedDeletingNow]
    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosIdsOnOperating, setTodosIdsOnOperating] = useState<number[]>([]);
  const [toggleToStatus, setToggleToStatus]
    = useState<boolean | null>(null);

  const visibleTodos = filterTodos(todos, { filterBy });

  const value = {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    areCompletedDeletingNow,
    setAreCompletedDeletingNow,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    visibleTodos,
    todosIdsOnOperating,
    setTodosIdsOnOperating,
    toggleToStatus,
    setToggleToStatus,
  };

  return (
    <TodosDataContext.Provider value={value}>
      {children}
    </TodosDataContext.Provider>
  );
};

interface ContextProps {
  todos: Todo[],
  visibleTodos: Todo[],
  todoAdd: (newQuery: string) => Promise<boolean>,
  clearAllCompleted: () => void,
  todoDelete: (todoId: number) => Promise<boolean>,
  todoUpdate: (newTodo: Todo) => Promise<boolean>,
  isTodosHasCompleted: () => boolean,
  isEveryTodoCompleted: () => boolean,
  filterBy: Filter,
  setFilterBy: React.Dispatch<SetStateAction<Filter>>,
  errorMessage: string,
  areCompletedDeletingNow: boolean,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
  todosIdsOnOperating: number[],
  setTodosIdsOnOperating: React.Dispatch<SetStateAction<number[]>>,
  toggleToStatus: boolean | null,
  setToggleToStatus: React.Dispatch<SetStateAction<boolean | null>>,
  toggleAllToStatus: (newStatus: boolean) => Promise<boolean>,
}

export const TodosContext = React.createContext<ContextProps>({
  todos: [],
  visibleTodos: [],
  todoAdd: () => new Promise<boolean>(() => {}),
  clearAllCompleted: () => {},
  todoDelete: () => new Promise<boolean>(() => {}),
  todoUpdate: () => new Promise<boolean>(() => {}),
  isTodosHasCompleted: () => false,
  isEveryTodoCompleted: () => false,
  filterBy: Filter.ALL,
  setFilterBy: () => {},
  errorMessage: '',
  areCompletedDeletingNow: false,
  tempTodo: null,
  setTempTodo: () => {},
  todosIdsOnOperating: [],
  setTodosIdsOnOperating: () => {},
  toggleToStatus: null,
  setToggleToStatus: () => {},
  toggleAllToStatus: () => new Promise<boolean>(() => {}),
});

interface ProviderProps {
  children: React.ReactNode,
}

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    areCompletedDeletingNow,
    setAreCompletedDeletingNow,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    visibleTodos,
    todosIdsOnOperating,
    setTodosIdsOnOperating,
    toggleToStatus,
    setToggleToStatus,
  } = useContext(TodosDataContext);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos);
  }, []);

  const handleErrorOccuring = (errorTitle: string) => {
    setErrorMessage(errorTitle);

    const timerid = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerid);
  };

  const todoAdd = (newQuery: string) => {
    const normalizedQuery = newQuery.trim();

    return new Promise<boolean>((resolve, reject) => {
      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: normalizedQuery,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      addTodo(newTodo)
        .then((data) => {
          setTodos([...todos, data]);
          resolve(true);
        })
        .catch(() => {
          handleErrorOccuring('Unable to add a todo');
          reject(new Error(errorMessage));
        });
    })
      .catch(error => error);
  };

  const todoDelete = (todoId: number) => {
    return new Promise<boolean>((resolve, reject) => {
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevState => {
            return prevState.filter(todo => {
              return todo.id !== todoId;
            });
          });

          resolve(true);
        })
        .catch(() => {
          handleErrorOccuring('Unable to delete a todo');
          reject(new Error(errorMessage));
        });
    })
      .catch(error => error);
  };

  const todoUpdate = (newTodo: Todo) => {
    return new Promise<boolean>((resolve, reject) => {
      updateTodo(newTodo)
        .then(() => {
          setTodos(prevState => {
            return prevState.map(todo => {
              return todo.id === newTodo.id
                ? newTodo
                : todo;
            });
          });

          resolve(true);
        })
        .catch(() => {
          handleErrorOccuring('Unable to update a todo');
          reject(new Error(errorMessage));
        });
    });
  };

  const toggleAllToStatus = (newStatus: boolean) => {
    setToggleToStatus(newStatus);

    return new Promise<boolean>((resolve, reject) => {
      changeTodoStatusTo(todos, newStatus)
        .then(() => {
          setTodos(prevState => {
            return prevState.map(todo => {
              if (todo.completed !== newStatus) {
                const newTodo: Todo = {
                  ...todo,
                  completed: newStatus,
                };

                return newTodo;
              }

              return todo;
            });
          });

          resolve(true);
        })
        .catch(() => {
          handleErrorOccuring('Unable to update a todo');
          reject(new Error(errorMessage));
        })
        .finally(() => setToggleToStatus(null));
    });
  };

  const clearAllCompleted = () => {
    const todosIdsToOperate = [...todos]
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setAreCompletedDeletingNow(true);

    deleteAllTodos(todosIdsToOperate)
      .then(() => {
        setTodos(prevState => {
          return prevState.filter(todo => {
            return !todosIdsToOperate.includes(todo.id);
          });
        });

        setAreCompletedDeletingNow(false);
      });
  };

  const isTodosHasCompleted = () => {
    return todos.some(todo => todo.completed);
  };

  const isEveryTodoCompleted = () => {
    return todos.every(todo => todo.completed);
  };

  const value = {
    todos,
    visibleTodos,
    todoAdd,
    clearAllCompleted,
    todoDelete,
    todoUpdate,
    isTodosHasCompleted,
    isEveryTodoCompleted,
    filterBy,
    setFilterBy,
    errorMessage,
    areCompletedDeletingNow,
    tempTodo,
    setTempTodo,
    todosIdsOnOperating,
    setTodosIdsOnOperating,
    toggleToStatus,
    setToggleToStatus,
    toggleAllToStatus,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

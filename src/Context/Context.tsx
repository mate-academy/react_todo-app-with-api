import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Error, States, Todo } from '../types/Todo';
import {
  addTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from '../api/todos';
import { getFilteredTodos } from '../helpers';

const USER_ID = 12023;

interface TodoContextType {
  renderedTodos: Todo[];
  setRenderedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredList: Todo[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  handleInput:(value:React.ChangeEvent<HTMLInputElement>) => void;
  todoTitle: string;
  handleSubmitForm: (event:React.FormEvent) => void;
  tempTodo: Todo | null;
  isDisabled: boolean;
  handleDelete: (value: number) => Promise<void>;
  multiplyDelete: () => void;
  todosForDelete: number[];
  onDelete: number[];
  editTodo: (todo:Todo) => Promise<void>;
  toggleTodoCompleted: (todo: Todo) => void;
  setOnDelete: (value: number[]) => void;
}

const TodoContext = createContext<TodoContextType>(
  {
    renderedTodos: [],
    setRenderedTodos: () => {},
    filteredList: [],
    selectedOption: '',
    setSelectedOption: () => {},
    errorMessage: '',
    setErrorMessage: () => {},
    handleInput: () => {},
    todoTitle: '',
    handleSubmitForm: () => {},
    tempTodo: null,
    isDisabled: false,
    handleDelete: async () => {},
    multiplyDelete: () => {},
    todosForDelete: [],
    onDelete: [],
    editTodo: async () => {},
    toggleTodoCompleted: () => {},
    setOnDelete: () => {},
  },
);

export const useTodoContext = () => useContext(TodoContext);
type Props = {
  children: React.ReactNode
};

export const TodoContextProvider: FC<Props> = ({ children }) => {
  const [renderedTodos, setRenderedTodos] = useState<Todo[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>(States.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [onDelete, setOnDelete] = useState<number[]>([]);

  const todosForDelete = useMemo(() => renderedTodos
    .filter(({ completed }) => completed)
    .map(todo => todo.id), [renderedTodos]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setTodoTitle(value);
    }, [],
  );

  const createTodo = useCallback((title: string, userId: number) => {
    const temporaryValue = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setTempTodo(temporaryValue);

    return addTodo({ title, completed: false, userId })
      .then(newTodo => {
        setRenderedTodos(currentRenderedTodos => [...currentRenderedTodos,
          newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.Load);
        throw error;
      });
  }, [todoTitle]);

  const handleDelete = useCallback((todoId:number) => {
    setOnDelete(curentTodoIds => [...curentTodoIds, todoId]);

    return removeTodo(todoId)
      .then(() => setRenderedTodos(currenTodos => currenTodos
        .filter(todo => todo.id !== todoId)))
      .catch((error) => {
        setErrorMessage(Error.Remove);
        throw error;
      })
      .finally(() => {
        setOnDelete([]);
      });
  }, []);

  const multiplyDelete = useCallback(() => {
    setOnDelete(todosForDelete);
    setTimeout(() => {
      setRenderedTodos(currentTodos => currentTodos
        .filter(({ completed }) => !completed));
    }, 500);
    todosForDelete.forEach(id => handleDelete(id));
  }, [handleDelete, todosForDelete]);

  const handleSubmitForm = useCallback((event:React.FormEvent) => {
    setErrorMessage('');
    event.preventDefault();
    const preaperedTitle = todoTitle.trim();

    if (!preaperedTitle) {
      setErrorMessage(Error.Title);

      return;
    }

    setIsDisabled(true);

    createTodo(todoTitle.trim(), USER_ID)
      .then(() => setTodoTitle(''))
      .catch(() => setErrorMessage(Error.Load))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  }, [createTodo, todoTitle]);

  const editTodo = useCallback((todo: Todo) => {
    setOnDelete(curentTodos => [...curentTodos, todo.id]);

    return patchTodo(todo)
      .then(patchedTodo => setRenderedTodos(currentTodos => currentTodos
        .map(currentTodo => {
          if (currentTodo.id === patchedTodo.id) {
            return patchedTodo;
          }

          return currentTodo;
        })))
      .catch((error) => {
        setErrorMessage(Error.update);
        throw error;
      });
  }, []);

  const toggleTodoCompleted = useCallback((todo: Todo) => {
    editTodo({ ...todo, completed: !todo.completed })
      .catch(() => {})
      .finally(() => {
        setOnDelete([]);
      });
  }, [editTodo]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setRenderedTodos)
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  const filteredList = useMemo(() => getFilteredTodos(renderedTodos,
    selectedOption),
  [renderedTodos, selectedOption]);

  const value: TodoContextType = useMemo(() => ({
    renderedTodos,
    setRenderedTodos,
    filteredList,
    selectedOption,
    setSelectedOption,
    errorMessage,
    setErrorMessage,
    handleInput,
    todoTitle,
    handleSubmitForm,
    tempTodo,
    isDisabled,
    handleDelete,
    multiplyDelete,
    todosForDelete,
    onDelete,
    editTodo,
    toggleTodoCompleted,
    setOnDelete,
  }), [editTodo, filteredList, errorMessage, handleDelete,
    handleInput, handleSubmitForm, isDisabled, multiplyDelete,
    onDelete, renderedTodos, selectedOption, tempTodo, todoTitle,
    todosForDelete, toggleTodoCompleted]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

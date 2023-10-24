import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as todosServices from './api/todos';
import { TodosContextType } from './types/TodosContextTypes';

export const USER_ID = 11587;

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  filtredTodos: [],
  isLoadingTodo: [],
  errorMessage: '',
  setErrorMessage: () => {},
  statusFilter: Filter.ALL,
  setStatusFilter: () => {},
  title: '',
  setTitle: () => {},
  statusResponse: false,
  setStatusResponse: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  changeErrorMessage: () => {},
  addTodo: () => {},
  deleteTodo: () => {},
  updateTodo: async () => {},
  activeTodos: 0,
  hasSomeCompletedTodos: false,
  handleClearCompleted: () => {},
  toggleTodo: () => {},
  handleToggleAll: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(Filter.ALL);
  const [title, setTitle] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function changeErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  React.useEffect(() => {
    todosServices
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        changeErrorMessage('Unable to load todos');
      });
  }, []);

  const filtredTodos: Todo[] = React.useMemo(() => {
    let filtered = todos;

    switch (statusFilter) {
      case Filter.ACTIVE:
        filtered = filtered.filter(todo => !todo.completed);
        break;

      case Filter.COMPLETED:
        filtered = filtered.filter(todo => todo.completed);

        break;

      default:
        break;
    }

    return filtered;
  }, [todos, statusFilter]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      changeErrorMessage('Title should not be empty');

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    todosServices
      .createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        changeErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoadingTodo((currentTodo) => [...currentTodo, todoId]);

    todosServices
      .removeTodo(todoId)
      .then(() => setTodos(
        (currentTodo) => currentTodo.filter((todo) => todo.id !== todoId),
      ))
      .catch(() => changeErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoadingTodo(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todoId,
        ),
      ));
  };

  const updateTodo = (todo: Todo) => {
    setIsLoadingTodo(currentTodo => [...currentTodo, todo.id]);
    setStatusResponse(true);

    return todosServices.updateTodo(todo)
      .then(() => {
        setTodos(
          currentTodo => currentTodo.map((item) => (
            item.id === todo.id ? todo : item
          )),
        );
      })
      .catch(() => changeErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoadingTodo(currentTodo => currentTodo.filter(
          id => id !== todo.id,
        ));
      }) 
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const toggleTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => {})
      .catch(() => {});
  };

  const handleToggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filtredTodos,
      isLoadingTodo,
      errorMessage,
      setErrorMessage,
      statusFilter,
      setStatusFilter,
      title,
      setTitle,
      statusResponse,
      setStatusResponse,
      tempTodo,
      setTempTodo,
      changeErrorMessage,
      addTodo,
      deleteTodo,
      updateTodo,
      activeTodos,
      hasSomeCompletedTodos,
      handleClearCompleted,
      toggleTodo,
      handleToggleAll,
    }}
    >
      { children }
    </TodosContext.Provider>
  );
};

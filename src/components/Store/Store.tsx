import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';

type TodoContextType = {
  filteredTodos: Todo[];
  setTodos: (todo: Todo[]) => void;
  errorMessage: string;
  setErrorMessage: (textError: string) => void;
  filter: FilterBy;
  setFilter: (filter: FilterBy) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  query: string;
  setQuery: (text: string) => void;
  todos: Todo[];
  isDisabled: boolean;
  todosActive: number[] | null;
  setIsDisabled: (sow: boolean) => void;
  deleteTodo: (type: number) => void;
  updateData: (todo: Todo) => void;
  handleCompleteAll: () => void;
  handleComplete: () => void;
  completeTodos: Todo[];
  activeTodos: Todo[];
  addTodo: (newTodo: Todo) => Promise<void>;
  renameTodo: (newTodo: Todo) => Promise<void>;
  errorMessages: (error: string) => void;
  setTodosActive: (todos: number[]) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterBy.ALL);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [todosActive, setTodosActive] = useState<number[]>([]);

  const completeTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  function errorMessages(error: string) {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    if (todoService.USER_ID) {
      todoService
        .getTodos()
        .then(setTodos)
        .catch(() => errorMessages('Unable to load todos'));
    }
  }, []);

  function addTodo(newTodo: Todo) {
    setTodosActive(prev => [...prev, newTodo.id]);

    return todoService
      .createTodos(newTodo)
      .then(newTodos => {
        setTodos(current => {
          return [...current, newTodos];
        });
      })
      .finally(() => {
        setTodosActive([]);
      });
  }

  function deleteTodo(todoId: number) {
    errorMessages('');
    setTodosActive(prevIds => [...prevIds, todoId]);

    todoService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        errorMessages('Unable to delete a todo');
      })
      .finally(() => {
        setTodosActive(prevIds => prevIds.filter(id => id !== todoId));
      });
  }

  function updateData(todoUpdate: Todo) {
    setErrorMessage('');
    setTodosActive(prev => [...prev, todoUpdate.id]);

    todoService
      .updateTodos({
        ...todoUpdate,
        completed: !todoUpdate.completed,
      })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      })
      .catch(() => errorMessages('Unable to update a todo'))
      .finally(() => {
        setTodosActive(prev => prev.filter(id => id !== todoUpdate.id));
      });
  }

  const handleCompleteAll = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => updateData(todo));
    } else {
      completeTodos.forEach(todo => updateData(todo));
    }
  };

  function handleComplete() {
    completeTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  }

  function renameTodo(todoToRename: Todo) {
    errorMessages('');
    setTodosActive(prevIds => [...prevIds, todoToRename.id]);

    return todoService
      .updateTodos(todoToRename)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        errorMessages('Unable to update a todo');

        throw error;
      })
      .finally(() => setTodosActive([]));
  }

  const filteredTodos = useMemo(() => {
    let preparedTodos = [...todos];

    switch (filter) {
      case FilterBy.ACTIVE:
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;
      case FilterBy.COMPLETED:
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;
      default:
        return preparedTodos;
    }

    return preparedTodos;
  }, [todos, filter]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        errorMessage,
        filter,
        setFilter,
        filteredTodos,
        setTodos,
        setErrorMessage,
        tempTodo,
        setTempTodo,
        query,
        setQuery,
        todosActive,
        isDisabled,
        setIsDisabled,
        handleCompleteAll,
        handleComplete,
        deleteTodo,
        updateData,
        completeTodos,
        activeTodos,
        addTodo,
        renameTodo,
        errorMessages,
        setTodosActive,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};

export default TodoContext;

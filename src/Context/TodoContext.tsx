import React, { createContext, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import * as todoService from '../api/todos';
import { getCompletedTodos, getUncompletedTodos } from '../utils/countTodos';

interface TodoContextTypes {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  completedTodos: Todo[];
  uncompletedTodos: Todo[];
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todosIdToProcess: number[];
  setTodosIdToProcess: React.Dispatch<React.SetStateAction<number[]>>;
  handleAddTodo: (todoTitle: string) => Promise<void>;
  handleDeleteTodo: (todoId: number) => void;
  handleRenameTodo: (todo: Todo, newTodoTitle: string) => void;
  handleClearCompletedTodos: () => void;
  handleStatusTodoChange: (todo: Todo) => void;
}

const initTodoContext: TodoContextTypes = {
  todos: [],
  setTodos: () => {},
  completedTodos: [],
  uncompletedTodos: [],
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosIdToProcess: [],
  setTodosIdToProcess: () => {},
  handleAddTodo: async () => {},
  handleDeleteTodo: () => {},
  handleRenameTodo: () => {},
  handleClearCompletedTodos: () => {},
  handleStatusTodoChange: () => {},
};

export const TodoContext = createContext(initTodoContext);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosIdToProcess, setTodosIdToProcess] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const completedTodos = getCompletedTodos(todos);
  const uncompletedTodos = getUncompletedTodos(todos);

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    });

    return todoService
      .addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodosIdToProcess(prevState => [...prevState, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodosIdToProcess(prevState => prevState.filter(id => id !== todoId));
      });
  };

  const handleRenameTodo = (todo: Todo, newTodoTitle: string) => {
    setTodosIdToProcess(prevState => [...prevState, todo.id]);
    todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevTodos => prevTodos.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setTodosIdToProcess(
          prevState => prevState.filter(id => id !== todo.id),
        );
      });
  };

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(todo => (
      handleDeleteTodo(todo.id)));
  };

  const handleStatusTodoChange = (todo: Todo) => {
    setTodosIdToProcess(prevState => [...prevState, todo.id]);
    todoService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevTodos => prevTodos.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosIdToProcess(
          prevState => prevState.filter(id => id !== todo.id),
        );
      });
  };

  const value = useMemo(() => ({
    todos,
    setTodos,
    completedTodos,
    uncompletedTodos,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    todosIdToProcess,
    setTodosIdToProcess,
    handleAddTodo,
    handleDeleteTodo,
    handleRenameTodo,
    handleClearCompletedTodos,
    handleStatusTodoChange,
  }), [todos, errorMessage, tempTodo, todosIdToProcess]);

  return (
    <TodoContext.Provider
      value={value}
    >
      {children}
    </TodoContext.Provider>
  );
};

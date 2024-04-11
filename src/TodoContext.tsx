import { createContext, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterOption } from './enums/FilterOption';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoContextType } from './types/TodoContextType';
import { Errors } from './enums/Errors';
import { deleteTodo, updateTodo } from './api/todos';
import { onErrors } from './utils/onErrors';

export const TodosContext = createContext<TodoContextType | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOption>(FilterOption.ALL);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [inputFocus, setInputFocus] = useState<boolean>(true);

  const preparedTodos = getFilteredTodos(todos, filterBy);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const onTodoDelete = (todoId: number): void => {
    setLoadingTodosIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(() => {
        onErrors(Errors.DeleteTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodosIds([]);
        setInputFocus(true);
      });
  };

  const toggleTodo = (todo: Todo) => {
    setLoadingTodosIds(prev => [...prev, todo.id]);

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => onErrors(Errors.UpdateTodo, setErrorMessage))
      .finally(() => {
        setLoadingTodosIds([]);
      });
  };

  const contextValues = {
    todos,
    setTodos,
    preparedTodos,
    activeTodos,
    completedTodos,
    errorMessage,
    setErrorMessage,
    onTodoDelete,
    tempTodo,
    setTempTodo,
    filterBy,
    setFilterBy,
    loadingTodosIds,
    setLoadingTodosIds,
    inputFocus,
    setInputFocus,
    toggleTodo,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { Todo, TodoID, TodoUpdate } from '../types/Todo';
import { TodosFilterQuery } from '../types/TodosFilterQuery';
import getPreparedTodos from '../utils/getPreparedTodos';
import {
  addTodo as addTodoOnServer,
  deleteTodo as deleteTodoOnServer,
  getTodos,
  updateTodo as updateTodoOnServer,
} from '../api/todos';

interface TodosContextType {
  todos:Todo[],
  activeTodos:Todo[],
  completedTodos:Todo[],
  preparedTodos:Todo[],
  query:TodosFilterQuery,
  error:string,
  tempTodo:null | Todo,
  addTodo:((newTodo:Todo) => Promise<void>) | null,
  deleteTodo:((todoID:TodoID) => Promise<void>) | null,
  updateTodo:((todo:TodoUpdate) => Promise<void>) | null,
  setQuery:React.Dispatch<React.SetStateAction<TodosFilterQuery>>,
  setError:React.Dispatch<React.SetStateAction<string>>,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  activeTodos: [],
  completedTodos: [],
  preparedTodos: [],
  query: TodosFilterQuery.all,
  error: '',
  tempTodo: null,
  addTodo: null,
  deleteTodo: null,
  updateTodo: null,
  setQuery: () => {
  },
  setError: () => {
  },
});

export const TodosProvider:React.FC<{ children:React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState(TodosFilterQuery.all);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Something went wrong. Failed to load todos'));
  }, []);

  const preparedTodos = useMemo(
    () => getPreparedTodos(todos, query),
    [todos, query],
  );

  const { active: activeTodos, completed: completedTodos } = useMemo(() => (
    todos.reduce<{ active:Todo[]; completed:Todo[] }>(
      (sortedTodos, todo) => {
        if (todo.completed) {
          sortedTodos.completed.push(todo);
        } else {
          sortedTodos.active.push(todo);
        }

        return sortedTodos;
      }, { active: [], completed: [] },
    )
  ), [todos]);

  const addTodo = (newTodo:Todo) => {
    setTempTodo(newTodo);

    return addTodoOnServer(newTodo).then((newTodoFromServer) => {
      setTodos(prevTodos => [...prevTodos, newTodoFromServer]);
    }).finally(() => setTempTodo(null));
  };

  const updateTodo = (todoToUpdate:TodoUpdate) => {
    return updateTodoOnServer(todoToUpdate).then(updatedTodo => {
      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id === updatedTodo.id ? updatedTodo : todo
        ))));
    }).catch(() => setError('Unable to update a todo'));
  };

  const deleteTodo = (todoID:TodoID) => {
    return deleteTodoOnServer(todoID).then(() => {
      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoID)
      ));
    }).catch(() => setError('Unable to delete a todo'));
  };

  const value:TodosContextType = {
    todos,
    activeTodos,
    completedTodos,
    preparedTodos,
    query,
    error,
    tempTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    setQuery,
    setError,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

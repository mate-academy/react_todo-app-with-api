import {
  FC, ReactNode, createContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import {
  getTodos, postTodo, deleteTodo, updateTodo,
} from '../api/todos';
import { TodoStatus, ErrorType, Todo } from '../types';
import { getFilteredTodos } from '../utils/getFilteredTodos';

type Props = {
  children: ReactNode;
};

interface Context {
  activeTodosLeft: number;
  todosCount: number;
  todos: Todo[];
  tempTodo: Todo | null;
  error: ErrorType | null;
  filterBy: TodoStatus;
  isLoading: boolean;
  selectedTodoIds: number[];
  onTodosChange: (value: Todo[]) => void;
  onErrorChange: (value: ErrorType | null) => void;
  onFilterByChange: (value: TodoStatus) => void;
  onAddNewTodo: (todoTitle: string) => Promise<boolean>;
  onDeleteTodo: (todoId: number) => void;
  onDeleteCompletedTodos: () => void;
  onUpdateTodo: (todo: Todo) => void;
  onToggleSeveralTodos: () => void;
}

const USER_ID = 11043;

export const TodoContext = createContext({} as Context);

export const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(TodoStatus.All);
  const [error, setError] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, filterBy)
  ), [todos, filterBy]);

  const activeTodosLeft = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  useEffect(() => {
    setError(null);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.IncorrectUrl));
  }, []);

  const onAddNewTodo = useCallback((todoTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setError(null);
    setTempTodo(newTodo);
    setIsLoading(true);

    return postTodo(USER_ID, newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);

        return true;
      })
      .catch(() => {
        setError(ErrorType.AddTodoError);

        return false;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }, []);

  const onDeleteTodo = useCallback((todoId: number) => {
    setSelectedTodoIds(prevTodos => [...prevTodos, todoId]);
    setError(null);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => setError(ErrorType.DeleteTodoError))
      .finally(() => {
        setSelectedTodoIds(prevTodoIds => (
          prevTodoIds.filter(id => id !== todoId)
        ));
      });
  }, []);

  const onDeleteCompletedTodos = useCallback(async () => {
    setError(null);

    try {
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setSelectedTodoIds(completedTodosIds);

      const deleteTasks = completedTodosIds.map(todoId => (
        deleteTodo(todoId)
      ));

      await Promise.all(deleteTasks);

      await setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError(ErrorType.DeleteTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const onUpdateTodo = useCallback(async (todo: Todo) => {
    setError(null);

    try {
      const updatedTodoIds = [...selectedTodoIds, todo.id];

      setSelectedTodoIds(updatedTodoIds);

      const updatedTodo = await updateTodo(todo.id, todo);

      setTodos(prevTodos => prevTodos.map(prevTodo => (
        prevTodo.id === todo.id
          ? { ...updatedTodo }
          : prevTodo
      )));
    } catch {
      setError(ErrorType.UpdateTodoError);
    } finally {
      setSelectedTodoIds(prevTodoIds => (
        prevTodoIds.filter(id => id !== todo.id)
      ));
    }
  }, [selectedTodoIds]);

  const onToggleSeveralTodos = useCallback(async () => {
    try {
      const targetTodos = todos.filter((todo) => (
        todo.completed === !activeTodosLeft
      ));

      setSelectedTodoIds(targetTodos.map(todo => todo.id));

      const updatedTodos = targetTodos.map(todo => (
        updateTodo(todo.id, { ...todo, completed: !todo.completed })
      ));

      const result = await Promise.all(updatedTodos);

      setTodos(prevTodos => (
        prevTodos.map(todo => {
          const updatedTodo = result.find(targetTodo => (
            targetTodo.id === todo.id
          ));

          if (updatedTodo) {
            return updatedTodo;
          }

          return todo;
        })
      ));
    } catch {
      setError(ErrorType.UpdateTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const contextValue: Context = {
    activeTodosLeft,
    todosCount: todos.length,
    todos: filteredTodos,
    tempTodo,
    error,
    filterBy,
    isLoading,
    selectedTodoIds,
    onTodosChange: setTodos,
    onErrorChange: setError,
    onFilterByChange: setFilterBy,
    onAddNewTodo,
    onDeleteTodo,
    onDeleteCompletedTodos,
    onUpdateTodo,
    onToggleSeveralTodos,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

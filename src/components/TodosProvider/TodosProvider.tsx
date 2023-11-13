import React, {
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  getTodos, postTodo, updateTodo, deleteTodo,
} from '../../api/todos';

import { USER_ID } from '../../utils/constants';
import { NoIdTodo } from '../../types/NoIdTodo';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { FilterType } from '../../types/FilterType';

interface TodosContextType {
  todosFromServer: Todo[];
  todosError: string;
  isEditing: boolean;
  filteredTodos: Todo[];
  filter: FilterType;
  responceTodo: Todo | string;
  tempTodo: Todo | null;
  processingTodoIds: number[];
  setTodosError: (error: string) => void;
  addTodoHandler: (newTodo: NoIdTodo) => void;
  updateTodoHandler: (updatedTodo: Todo) => void;
  deleteTodoHandler: (updatedTodoId: number) => void;
  onFilterChange: (newFilter: FilterType) => void;
  deleteAllCompleted: () => void;
  toggleAll: () => void;
  setProcessingTodoIds: (updatedTodoArr: number[]) => void;
  setIsEditing: (value: boolean) => void;
}

export const TodosContext = React.createContext<TodosContextType>({
  todosFromServer: [],
  todosError: '',
  isEditing: false,
  filteredTodos: [],
  filter: FilterType.all,
  responceTodo: 'default',
  tempTodo: null,
  processingTodoIds: [0],
  setTodosError: () => {},
  addTodoHandler: () => {},
  updateTodoHandler: () => {},
  deleteTodoHandler: () => {},
  onFilterChange: () => {},
  deleteAllCompleted: () => {},
  toggleAll: () => {},
  setProcessingTodoIds: () => {},
  setIsEditing: () => {},
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([0]);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [responceTodo, setResponceTodo] = useState<Todo | string>('default');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosError, setTodosError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState(FilterType.all);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const onFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  useEffect(() => {
    setFilteredTodos((prev) => {
      if (!isEditing) {
        return getFilteredTodos(filter, todosFromServer);
      }

      return prev;
    });
  }, [filter, isEditing, todosFromServer]);

  useEffect(() => {
    setIsEditing(true);
    getTodos(USER_ID)
      .then((data) => {
        setTodosFromServer(data);
      })
      .catch(() => {
        setTodosError('Unable to load todos');
      })
      .finally(() => setIsEditing(false));
  }, []);

  const addTodoHandler = useCallback(async (newTodo: NoIdTodo) => {
    setTodosError('');
    setIsEditing(true);
    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const createdTodo = await postTodo(newTodo);

      setTempTodo(null);
      setResponceTodo(createdTodo);
      setTodosFromServer(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setTempTodo(null);
      setTodosError('Unable to add a todo');
    } finally {
      setIsEditing(false);
    }
  }, []);

  const updateTodoHandler = useCallback(async (todo: Todo) => {
    setProcessingTodoIds(prev => [...prev, todo.id]);
    setTodosError('');
    setIsEditing(true);

    try {
      const updatedTodo = await updateTodo(todo);

      setTodosFromServer(prev => prev.map(prevTodo => (
        prevTodo.id === updatedTodo.id
          ? updatedTodo
          : prevTodo
      )));
    } catch (e) {
      setTodosError('Unable to update todo');
    } finally {
      setIsEditing(false);
      setProcessingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  }, []);

  const deleteTodoHandler = useCallback(async (id: number) => {
    setIsEditing(true);
    setTodosError('');
    setProcessingTodoIds(prev => [...prev, id]);

    try {
      const isTodoDelete = await deleteTodo(id);

      if (isTodoDelete) {
        setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      } else {
        setTodosError('Unable to delete a todo');
      }
    } catch (e) {
      setTodosError('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== id));
      setIsEditing(false);
    }
  }, []);

  const deleteAllCompleted = useCallback(async (): Promise<boolean> => {
    setIsEditing(true);
    const allCompleted = todosFromServer.filter((t) => t.completed);
    const allCompletedIds: number[] = allCompleted.map((t) => t.id);

    setProcessingTodoIds((prev) => [...prev, ...allCompletedIds]);

    await Promise.allSettled(
      allCompleted.map((todo) => deleteTodoHandler(todo.id)),
    );
    setIsEditing(false);

    return true;
  }, [todosFromServer, deleteTodoHandler]);

  const toggleAll = useCallback(async (): Promise<void> => {
    const isAllCompleted = todosFromServer.every((todo) => todo.completed);

    const todosToUpdate = todosFromServer.filter((todo) => (isAllCompleted
      ? todo.completed : !todo.completed));

    await Promise.all(
      todosToUpdate.map((todo) => updateTodoHandler({
        ...todo,
        completed: !isAllCompleted,
      })),
    );
  }, [todosFromServer, updateTodoHandler]);

  const value = useMemo(
    () => ({
      todosFromServer,
      todosError,
      isEditing,
      filteredTodos,
      filter,
      responceTodo,
      tempTodo,
      processingTodoIds,
      setTodosError,
      addTodoHandler,
      updateTodoHandler,
      deleteTodoHandler,
      onFilterChange,
      deleteAllCompleted,
      toggleAll,
      setProcessingTodoIds,
      setIsEditing,
    }),
    [
      todosFromServer,
      todosError,
      isEditing,
      filteredTodos,
      filter,
      responceTodo,
      tempTodo,
      processingTodoIds,
      setTodosError,
      addTodoHandler,
      updateTodoHandler,
      deleteTodoHandler,
      onFilterChange,
      deleteAllCompleted,
      toggleAll,
      setProcessingTodoIds,
      setIsEditing,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

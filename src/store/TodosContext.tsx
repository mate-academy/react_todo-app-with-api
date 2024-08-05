import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { DELAY, OptionsTodos } from '../constans';
import { todosService } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodosContextType } from '../types/ContextType';

export const TodosContext = React.createContext<TodosContextType>({
  todos: [] as Todo[],
  selectedTodo: null,
  setSelectedTodo: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  loading: false,
  setLoading: () => {},
  option: OptionsTodos.ALL,
  setOption: () => {},
  deletedTodosId: null,
  updatedTodos: null,
  loadTodos: async () => {},
  addTodo: async () => {},
  deletedTodos: () => {},
  updateTodos: () => {},
  newError: () => {},
  titleField: { current: null },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = memo(
  function TodosProviderComponent({ children }) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [tempTodo, setTempTodo] = useState<Todo | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [deletedTodosId, setDeletedTodosId] = useState<number[] | null>(null);
    const [updatedTodos, setUpdatedTodos] = useState<Todo[] | null>(null);
    const [option, setOption] = useState<OptionsTodos>(OptionsTodos.ALL);

    const titleField = useRef<HTMLInputElement>(null);

    const newError = (error: string) => {
      setErrorMessage(error);
      setTimeout(() => setErrorMessage(''), DELAY);
    };

    const loadTodos = useCallback(async () => {
      setErrorMessage('');

      try {
        const todosFromService = await todosService.get();

        setTodos(todosFromService);
      } catch {
        newError('Unable to load todos');
      }
    }, []);

    const addTodo = useCallback(async ({ userId, completed, title }: Todo) => {
      setErrorMessage('');

      try {
        const newTodo = await todosService.create({ userId, completed, title });

        setTodos(currentTodos => [...currentTodos, newTodo]);
      } catch (error) {
        newError('Unable to add a todo');
        throw error;
      } finally {
        setTempTodo(null);
      }
    }, []);

    const deletedTodos = useCallback(
      async (todosId: number[]) => {
        setErrorMessage('');
        setLoading(true);
        setDeletedTodosId(todosId);

        const deletedTodosForId = todosId.map(async id => {
          try {
            await todosService.delete(id);

            if (selectedTodo) {
              setSelectedTodo(null);
            }

            setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
          } catch {
            newError('Unable to delete a todo');
          }
        });

        Promise.allSettled([...deletedTodosForId]).finally(() => {
          setLoading(false);
          setDeletedTodosId(null);
        });
      },
      [selectedTodo],
    );

    const updateTodos = useCallback(
      (todosForUpdate: Todo[]) => {
        setErrorMessage('');
        setLoading(true);
        setUpdatedTodos(todosForUpdate);

        const updateTodosPromise = todosForUpdate.map(async todoForUpdate => {
          try {
            const newTodo = await todosService.update(todoForUpdate);

            if (selectedTodo) {
              setSelectedTodo(null);
            }

            setTodos(currentTodos => {
              const newTodos = [...currentTodos];
              const index = newTodos.findIndex(
                todo => todo.id === todoForUpdate.id,
              );

              newTodos.splice(index, 1, newTodo);

              return newTodos;
            });
          } catch {
            if (titleField.current) {
              titleField.current.focus();
            }

            newError('Unable to update a todo');
          }
        });

        Promise.allSettled([...updateTodosPromise]).finally(() => {
          setLoading(false);
          setUpdatedTodos(null);
        });
      },
      [selectedTodo],
    );

    const value = useMemo(
      () => ({
        todos,
        selectedTodo,
        setSelectedTodo,
        tempTodo,
        setTempTodo,
        errorMessage,
        setErrorMessage,
        loading,
        setLoading,
        option,
        setOption,
        deletedTodosId,
        updatedTodos,
        loadTodos,
        addTodo,
        deletedTodos,
        updateTodos,
        newError,
        titleField,
      }),
      [
        addTodo,
        deletedTodos,
        deletedTodosId,
        errorMessage,
        loadTodos,
        loading,
        option,
        selectedTodo,
        tempTodo,
        todos,
        updateTodos,
        updatedTodos,
      ],
    );

    return (
      <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
    );
  },
);

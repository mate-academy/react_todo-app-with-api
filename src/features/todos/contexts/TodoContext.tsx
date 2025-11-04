import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
  useRef,
} from 'react';
import { ErrorType, Todo, TodoBase } from '../model/types';
import { Action, ACTIONS } from '../model/actions';
import { initialState, todosReducer, TodosState } from '../model/reducer';
import {
  createTodo,
  renameTodo,
  deleteTodo,
  toggleTodo,
  getTodos,
} from '../api/todos';
import { useNotification } from '../contexts/NotificationContext';

type TodosContextType = {
  state: TodosState;
  handleAddTodo: (todo: TodoBase) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<boolean>;
  handleRenameTodo: (id: number, title: string) => Promise<boolean>;
  handleToggleTodo: (id: number, completed: boolean) => Promise<void>;
  handleToggleAll: () => Promise<void>;
  deletingTodoIds: number[];
  processingIds: number[];
  dispatch: React.Dispatch<Action>;
};

export const TodosContext = createContext<TodosContextType>({
  state: initialState,
  handleAddTodo: async () => {},
  handleDeleteTodo: async () => false,
  handleRenameTodo: async () => false,
  handleToggleTodo: async () => {},
  handleToggleAll: async () => {},
  deletingTodoIds: [],
  processingIds: [],
  dispatch: () => undefined,
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const { showNotification } = useNotification();

  const toggleSeqRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    let isMounted = true;

    (async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      try {
        const fetched = await getTodos();

        if (!isMounted) {
          return;
        }

        dispatch({ type: ACTIONS.SET_TODOS, payload: fetched });
        dispatch({ type: ACTIONS.SET_ERROR, payload: false });
      } catch {
        if (!isMounted) {
          return;
        }

        dispatch({ type: ACTIONS.SET_ERROR, payload: true });
        showNotification(ErrorType.LOAD_TODOS);
      } finally {
        if (!isMounted) {
          return;
        }

        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [showNotification]);

  const handleAddTodo = async (todo: TodoBase) => {
    const tempTodo: Todo = { ...todo, id: 0 };

    dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: tempTodo });

    try {
      const created = await createTodo(todo);

      dispatch({ type: ACTIONS.ADD_TODO, payload: created });
      dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: null });
    } catch {
      dispatch({ type: ACTIONS.SET_TEMP_TODO, payload: null });
      throw new Error(ErrorType.ADD_TODO);
    }
  };

  const handleDeleteTodo = async (id: number): Promise<boolean> => {
    setDeletingTodoIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });

      return true;
    } catch {
      return false;
    } finally {
      setDeletingTodoIds(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleRenameTodo = async (
    id: number,
    title: string,
  ): Promise<boolean> => {
    const prev = state.todos;

    setProcessingIds(p => [...p, id]);

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: prev.map(t => (t.id === id ? { ...t, title } : t)),
    });

    try {
      await renameTodo(id, title);

      return true;
    } catch {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prev });
      showNotification(ErrorType.UPDATE_TODO);

      return false;
    } finally {
      setProcessingIds(p => p.filter(x => x !== id));
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const newCompleted = !completed;

    const mySeq = (toggleSeqRef.current.get(id) ?? 0) + 1;

    toggleSeqRef.current.set(id, mySeq);

    setProcessingIds(p => [...p, id]);

    dispatch({
      type: ACTIONS.TOGGLE_TODO,
      payload: { id, completed: newCompleted },
    });

    try {
      await toggleTodo(id, completed);
    } catch {
      if (toggleSeqRef.current.get(id) === mySeq) {
        dispatch({
          type: ACTIONS.TOGGLE_TODO,
          payload: { id, completed },
        });
        showNotification(ErrorType.UPDATE_TODO);
      }
    } finally {
      setProcessingIds(p => p.filter(x => x !== id));
    }
  };

  const handleToggleAll = async () => {
    const prev = state.todos;
    const allCompleted = prev.every(t => t.completed);
    const changed = prev
      .filter(t => t.completed === allCompleted)
      .map(t => t.id);

    dispatch({
      type: ACTIONS.SET_TODOS,
      payload: prev.map(t => ({ ...t, completed: !allCompleted })),
    });

    try {
      await Promise.all(
        prev
          .filter(t => changed.includes(t.id))
          .map(t =>
            toggleTodo(
              t.id,
              t.completed === !allCompleted ? !allCompleted : allCompleted,
            ),
          ),
      );
    } catch {
      dispatch({ type: ACTIONS.SET_TODOS, payload: prev });
      showNotification(ErrorType.UPDATE_TODO);
    }
  };

  return (
    <TodosContext.Provider
      value={{
        state,
        handleAddTodo,
        handleDeleteTodo,
        handleRenameTodo,
        handleToggleTodo,
        handleToggleAll,
        deletingTodoIds,
        processingIds,
        dispatch,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

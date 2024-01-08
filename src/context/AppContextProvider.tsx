import {
  FC, useState, useEffect, MouseEvent, useMemo,
} from 'react';
import {
  deleteTodo, getTodos, patchTodo,
} from '../api/todos';
import { Todo, Filter } from '../types';
import { AppContext } from './AppContext';
import { ErrorMessage } from '../types/ErrorMessages';

type Props = React.PropsWithChildren;

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosBeingLoaded, setTodosBeingLoaded] = useState<number[]>([]);
  const [todoInEdit, setTodoInEdit] = useState<number | null>(null);

  // CONSTS

  // CALCULATING ACTIVE & COMPLETED TODOS
  const activeTodosNum = todos.reduce((acc, curr) => {
    return !curr.completed
      ? acc + 1
      : acc;
  }, 0);

  const completedTodosNum = todos.length - activeTodosNum;

  // LOADING DATA FROM THE SERVER
  const loadData = async () => {
    try {
      const response = await getTodos();

      setTodos(response);
    } catch (error) {
      setErrorMessage(ErrorMessage.LOAD);
      setShowError(true);
    }
  };

  // HANDLERS

  // REMOVE TODO
  const removeTodo = async (todoId: number) => {
    setTodosBeingLoaded(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
      setShowError(true);
    } finally {
      setTodosBeingLoaded(prev => prev.filter(id => id !== todoId));
    }
  };

  // RENAME TODO
  const renameTodo = async (
    todo: Todo,
    newTitle: string,
  ) => {
    if (todo.title === newTitle.trim()) {
      return;
    }

    if (!newTitle.trim()) {
      removeTodo(todo.id);

      return;
    }

    setTodosBeingLoaded(prev => [...prev, todo.id]);

    try {
      const response = await patchTodo(todo.id, { title: newTitle.trim() });
      const updatedTodos = todos.map(_todo => (
        _todo.id === todo.id
          ? response
          : _todo
      ));

      setTodos(updatedTodos as Todo[]);
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
      setShowError(true);
      throw new Error(ErrorMessage.UPDATE);
    } finally {
      setTodosBeingLoaded(prev => prev.filter(id => id !== todo.id));
    }
  };

  // TOGGLE TODO STATUS
  const changeTodoStatus = async (todoId: number, todoStatus: boolean) => {
    setTodosBeingLoaded(prev => ([...prev, todoId]));

    try {
      const response = await patchTodo(todoId, { completed: !todoStatus });

      setTodos(prevTodos => (
        prevTodos.map(item => (
          item.id === todoId
            ? response
            : item
        )) as Todo[]
      ));
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
      setShowError(true);
    } finally {
      setTodosBeingLoaded(prev => prev.filter(id => id !== todoId));
    }
  };

  // CHANGING FILTER
  const changeFilter = (event: MouseEvent<HTMLAnchorElement>) => {
    const { id } = event.target as HTMLAnchorElement;

    if (selectedFilter === id) {
      return;
    }

    setSelectedFilter(id as Filter);
  };

  // CLEAR ALL COMPLETED
  const clearCompleted = async () => {
    const completedTodos: Todo[] = todos.filter(todo => todo.completed);

    setTodosBeingLoaded(prev => ([
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]));

    completedTodos.map(async (todo) => {
      try {
        await deleteTodo(todo.id);
        setTodos(prev => prev
          .filter(todoToDelete => todoToDelete.id !== todo.id));
      } catch (error) {
        setErrorMessage(ErrorMessage.DELETE);
        setShowError(true);
      } finally {
        setTodosBeingLoaded([]);
      }
    });
  };

  // TOGGLE ALL
  const toggleAllStatus = async () => {
    try {
      let updatedTodos;

      if (todos.length === completedTodosNum) {
        setTodosBeingLoaded(todos.map(todo => todo.id));
        const responses = await Promise.all(
          todos.map(todo => patchTodo(todo.id, { ...todo, completed: false })),
        );

        updatedTodos = responses as Todo[];
      } else {
        const todosToUpdate = todos.filter(todo => !todo.completed);

        setTodosBeingLoaded(todosToUpdate.map(todo => todo.id));
        await Promise.all(
          todosToUpdate.map(todo => patchTodo(
            todo.id, { ...todo, completed: true },
          )),
        );

        updatedTodos = todos.map(todo => (
          todo.completed
            ? todo
            : { ...todo, completed: true }));
      }

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE);
      setShowError(true);
    } finally {
      setTodosBeingLoaded([]);
    }
  };

  // EFFECTS
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);

  // FILTERING TODOS
  const visibleTodos = useMemo(() => {
    let updatedTodos = [...todos];

    if (todos.length) {
      switch (selectedFilter) {
        case Filter.active:
          updatedTodos = updatedTodos.filter(todo => !todo.completed) || [];
          break;
        case Filter.completed:
          updatedTodos = updatedTodos.filter(todo => todo.completed) || [];
          break;
        default:
          break;
      }
    }

    return updatedTodos;
  }, [selectedFilter, todos]);

  const appContextValue = {
    todos,
    setTodos,
    selectedFilter,
    setSelectedFilter,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    visibleTodos,
    changeFilter,
    loadData,
    tempTodo,
    setTempTodo,
    todosBeingLoaded,
    setTodosBeingLoaded,
    completedTodosNum,
    activeTodosNum,
    clearCompleted,
    toggleAllStatus,
    removeTodo,
    changeTodoStatus,
    todoInEdit,
    setTodoInEdit,
    renameTodo,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

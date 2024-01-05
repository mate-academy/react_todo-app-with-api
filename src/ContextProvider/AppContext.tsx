import React, { createContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/Filter';
import { ErrorMessage, ErrorType } from '../types/Errors';
import * as todoService from '../api/todos';
import { USER_ID } from '../utils/userId';

interface IAppContext {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filterBy: FilterBy,
  setFilterBy: (arg: FilterBy) => void,
  errorMessage: ErrorMessage,
  setErrorMessage: (arg: ErrorMessage) => void,
  clearCompleted: () => void,
  selectedTodoIds: number[],
  setSelectedTodoIds: (arg: number[]) => void
  todoTitle: string,
  setTodoTitle: (arg: string) => void,
  isLoading: boolean,
  createNewTodo: (title: string) => void,
  tempTodo: Todo | null,
  setTempTodo: (arg: Todo | null) => void,
  deleteTodo: (arg: number) => void,
  patchTodo: (arg: Todo) => void,
  showError: (error: ErrorType) => void,
  handleToggleCompleted: (arg: Todo) => void,
  toggleAllTodos: () => void,
}

export const AppContext = createContext<IAppContext>({
  todos: [],
  setTodos: () => { },
  filterBy: FilterBy.All,
  setFilterBy: () => { },
  errorMessage: null,
  setErrorMessage: () => { },
  clearCompleted: () => { },
  selectedTodoIds: [],
  setSelectedTodoIds: () => { },
  todoTitle: '',
  setTodoTitle: () => { },
  isLoading: false,
  createNewTodo: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deleteTodo: () => { },
  patchTodo: () => { },
  handleToggleCompleted: () => { },
  toggleAllTodos: () => { },
  showError: () => { },
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showError = (error: ErrorType) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todoToFind => todoToFind.completed);

    setSelectedTodoIds(currentIds => ([
      ...currentIds,
      ...completedTodos.map(completedTodo => completedTodo.id),
    ]));

    completedTodos.forEach(completedTodo => (
      todoService.deleteTodo(completedTodo.id)
    ));

    setTimeout(() => {
      setTodos(currentTodos => (
        currentTodos.filter(todoToFilter => !todoToFilter.completed)
      ));
    }, 500);
  };

  const createNewTodo = ((title: string) => {
    const newTodoData = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsLoading(true);
    setSelectedTodoIds(ids => [...ids, 0]);
    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    todoService.createTodo(newTodoData)
      .then(newTodo => {
        setTodoTitle('');
        setTimeout(() => {
          setTodos(currentTodo => [...currentTodo, newTodo]);
        }, 500);
      })
      .catch(() => {
        setSelectedTodoIds(ids => ids.filter(
          id => id !== 0,
        ));
        setErrorMessage(ErrorType.LOAD);
        setTimeout(() => setErrorMessage(null), 2000);
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedTodoIds(ids => ids.filter(
          id => id !== 0,
        ));
        setTimeout(() => setTempTodo(null), 500);
      });
  });

  const deleteTodo = (
    (todoId: number) => {
      setSelectedTodoIds(currentIds => [...currentIds, todoId]);
      todoService.deleteTodo(todoId)
        .then(() => {
          setTimeout(() => {
            setTodos(currentTodos => currentTodos
              .filter(post => post.id !== todoId));
          }, 500);
        })
        .catch(() => {
          setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
          setErrorMessage(ErrorType.DELETE);
          setTimeout(() => setErrorMessage(null), 2000);
        })
        .finally(() => setTimeout(() => setSelectedTodoIds(ids => ids
          .filter(id => id !== todoId)), 500));
    });

  const patchTodo = (todo: Todo) => {
    setIsLoading(true);
    setSelectedTodoIds((ids) => [...ids, todo.id]);

    todoService.patchTodo(todo)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.map(currentTodo => (
            currentTodo.id === todo.id
              ? todo
              : currentTodo
          ))
        ));
      })
      .catch(() => {
        showError(ErrorType.UPDATE);
      })
      .finally(() => {
        setSelectedTodoIds(ids => ids.filter(
          id => id !== todo.id,
        ));

        setIsLoading(false);
      });
  };

  const handleToggleCompleted = async (todoChange: Todo) => {
    try {
      setSelectedTodoIds((currentIds) => [...currentIds, todoChange.id]);
      const updatedTodo = {
        ...todoChange,
        completed: !todoChange.completed,
      };

      const updatedTodos = await todoService.patchTodo(updatedTodo);

      setTodos((currentTodos) => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(
          (newTodo) => newTodo.id === updatedTodo.id,
        );

        newTodos.splice(index, 1, updatedTodos);

        return newTodos;
      });
    } catch (error) {
      showError(ErrorType.UPDATE);
    } finally {
      setSelectedTodoIds((ids) => ids.filter((id) => id !== todoChange.id));
    }
  };

  const toggleAllTodos = () => {
    const notCompleted = todos.every(todo => todo.completed);

    if (!notCompleted) {
      const allCompleted = todos.map(todo => {
        if (!todo.completed) {
          handleToggleCompleted(todo);
        }

        return todo;
      });

      setTodos(allCompleted);
    } else {
      const allNotCompleted = todos.map(todo => {
        handleToggleCompleted(todo);

        return todo;
      });

      setTodos(allNotCompleted);
    }
  };

  const value = ({
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    clearCompleted,
    setSelectedTodoIds,
    todoTitle,
    isLoading,
    createNewTodo,
    setTodoTitle,
    tempTodo,
    deleteTodo,
    selectedTodoIds,
    setTempTodo,
    toggleAllTodos,
    handleToggleCompleted,
    patchTodo,
    showError,
  });

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

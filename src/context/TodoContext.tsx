import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { editTodo, getTodos, postTodo } from '../api/todos';
import { ErrorType } from '../types/Errors';

type SelectedFilter = 'all' | 'active' | 'completed';

type TodoContext = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void;
  error: string | null,
  handleCloseError: () => void;
  setNewTodoTitle: (newTodoTitle: string) => void;
  newTodoTitle: string;
  setError: (errorName: string) => void;
  handleSelectFilter: (filterType: SelectedFilter) => void;
  selectedFilter: SelectedFilter;
  handleError: (errorName: ErrorType) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  userId: number;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  disabledInput: boolean;
  setDisabledInput: React.Dispatch<React.SetStateAction<boolean>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  editTodoLocally: (todo: Todo) => void;
  saveEditedTodo: (todo: Todo) => Promise<void>;
  handleToggleAll: () => void;
  setIsHeaderFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isHeaderFocused: boolean;
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  error: null,
  handleCloseError: () => { },
  setNewTodoTitle: () => '',
  newTodoTitle: '',
  setError: () => null,
  handleError: () => null,
  handleSelectFilter: () => { },
  selectedFilter: 'all',
  addTodo: () => { },
  userId: 0,
  deleteTodo: () => { },
  tempTodo: {
    id: 0, userId: 0, title: '', completed: false,
  },
  setTempTodo: () => { },
  disabledInput: false,
  setDisabledInput: () => { },
  activeTodos: [],
  completedTodos: [],
  editTodoLocally: () => [],
  saveEditedTodo: async () => {},
  handleToggleAll: () => {},
  setIsHeaderFocused: () => { },
  isHeaderFocused: false,
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [isHeaderFocused, setIsHeaderFocused] = useState(false);
  const userId = 11526;
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleError = (errorName: ErrorType) => {
    setError(errorName);
  };

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => handleError(ErrorType.Load));
  }, []);

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    setTempTodo({ ...todo, id: 0 });
    postTodo(todo)
      .then((response) => {
        setTodos(currentTodos => [response, ...currentTodos]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError(ErrorType.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setDisabledInput(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const editTodoLocally = (todo: Todo) => {
    setTodos((curr) => curr.map(item => (item.id === todo.id ? todo : item)));
  };

  const saveEditedTodo = (todo: Todo) => {
    return new Promise<void>((resolve, reject) => {
      editTodo(todo)
        .then((editedTodo) => {
          editTodoLocally(editedTodo);
          resolve();
        })
        .catch(() => {
          setError(ErrorType.Update);
          reject();
        });
    });
  };

  const handleToggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      const checkedTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      Promise.all(checkedTodos.map(todo => saveEditedTodo(todo)));
    } else if (todos.every(todo => !todo.completed)) {
      const unCheckedTodos = todos.map(todo => ({
        ...todo,
        completed: true,
      }));

      Promise.all(unCheckedTodos.map(todo => saveEditedTodo(todo)));
    } else {
      const updatedTodos = todos.map(todo => {
        if (!todo.completed) {
          return { ...todo, completed: true };
        }

        return todo;
      });

      Promise.all(updatedTodos.map(todo => saveEditedTodo(todo)));
    }
  };

  const handleSelectFilter = (filterType: SelectedFilter) => {
    setSelectedFilter(filterType);
  };

  return (
    <TodosContext.Provider value={{
      todos,
      error,
      setError,
      handleCloseError,
      setNewTodoTitle,
      newTodoTitle,
      handleSelectFilter,
      selectedFilter,
      handleError,
      addTodo,
      userId,
      deleteTodo,
      tempTodo,
      setTempTodo,
      disabledInput,
      setDisabledInput,
      setTodos,
      activeTodos,
      completedTodos,
      editTodoLocally,
      saveEditedTodo,
      handleToggleAll,
      setIsHeaderFocused,
      isHeaderFocused,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

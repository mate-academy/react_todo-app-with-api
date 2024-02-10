import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as todosApi from './api/todos';
import { Errors } from './types/Errors';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { TodosContextType } from './types/TodosContextType';

export const USER_ID = 11543;

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  addTodo: () => {},
  toggleTodo: () => {},
  toggleAll: () => {},
  clearCompleted: () => {},
  updateTodoTitle: () => {},
  selectedStatus: Status.All,
  setSelectedStatus: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  removeError: () => {},
  notCompletedTodos: [],
  tempTodo: null,
  isSubmiting: false,
  setIsSubmiting: () => {},
  title: '',
  setTitle: () => {},
  completedTodosIds: [],
  deletingIds: [],
  setDeletingIds: () => {},
  deleteTodo: () => {},
  editingIds: [],
  areAllTodosCompleted: false,
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);

  const removeError = (time = 3000) => {
    setTimeout(() => {
      setErrorMessage('');
    }, time);
  };

  useEffect(() => {
    todosApi.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.loading);

        removeError();
      });
  }, []);

  const addTodo = (currentTitle: string) => {
    setIsSubmiting(true);
    setErrorMessage('');

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: currentTitle,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    todosApi.createTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.adding);
        removeError();
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const toggleTodo = (id: number, toggledTodo: Todo) => {
    setEditingIds((ids) => [...ids, id]);
    setErrorMessage('');

    const editedTodo = {
      ...toggledTodo,
      completed: !toggledTodo.completed,
    };

    todosApi.editTodo(id, editedTodo)
      .then((updatedTodo: Todo) => {
        setTodos(todos.map(currTodo => (currTodo.id === updatedTodo.id
          ? { ...currTodo, completed: !currTodo.completed }
          : currTodo)));
      })
      .catch(() => {
        setErrorMessage(Errors.updating);
        removeError();
      })
      .finally(() => {
        setEditingIds((ids) => ids.filter(item => item !== id));
      });
  };

  const areAllTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const notCompletedTodos = useMemo(() => {
    return todos.filter(item => !item.completed);
  }, [todos]);

  const toggleAll = () => {
    const promiseArray = (areAllTodosCompleted
      ? completedTodos
      : notCompletedTodos);

    promiseArray.forEach(todo => {
      setEditingIds(ids => [...ids, todo.id]);
      todosApi.editTodo(todo.id, todo)
        .then(() => {
          setTodos(todos.map(elem => (
            { ...elem, completed: !areAllTodosCompleted }
          )));
        })
        .catch(() => {
          setErrorMessage(Errors.updating);
          removeError();
        })
        .finally(() => {
          setEditingIds(ids => ids.filter(item => item !== todo.id));
        });
    });

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllTodosCompleted,
    }));

    setTodos(updatedTodos);
  };

  const updateTodoTitle = (id: number, newTodoWithTitle: Todo) => {
    setIsSubmiting(true);
    setEditingIds((ids) => [...ids, id]);
    setErrorMessage('');

    setTodos(todos.map(prevTodo => (prevTodo.id === id
      ? { ...prevTodo, title: newTodoWithTitle.title }
      : prevTodo)));

    todosApi.editTodo(id, newTodoWithTitle)
      .then(() => {})
      .catch(() => {
        setErrorMessage(Errors.updating);
        removeError();
      })
      .finally(() => {
        setEditingIds((ids) => ids.filter(item => item !== id));
        setIsSubmiting(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);

    todosApi.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          item => item.id !== todoId,
        ));
      })
      .catch(() => {
        setErrorMessage(Errors.deleting);
        removeError();
      })
      .finally(() => {
        setDeletingIds((ids) => ids.filter(id => id !== todoId));
      });
  };

  const completedTodosIds = useMemo(() => {
    return todos
      .filter(item => item.completed)
      .map(el => el.id);
  }, [todos]);

  const clearCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      deleteTodo(todo.id);
    });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        toggleTodo,
        toggleAll,
        clearCompleted,
        updateTodoTitle,
        selectedStatus,
        setSelectedStatus,
        errorMessage,
        setErrorMessage,
        removeError,
        notCompletedTodos,
        tempTodo,
        isSubmiting,
        setIsSubmiting,
        title,
        setTitle,
        completedTodosIds,
        deletingIds,
        setDeletingIds,
        deleteTodo,
        editingIds,
        areAllTodosCompleted,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);

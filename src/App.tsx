import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useContext,
} from 'react';
import { Todo } from './types/Todo';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import {
  deleteTodoById,
  addNewTodo,
  updateTodoById,
  getTodos,
} from './api/todos';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingTodosContext, TodosContext } from './context/TodosContexts';

const USER_ID = 11497;

function getUpdatedTodos(
  todos: Todo[],
  updatedTodo: Todo,
  updatedField: keyof Todo,
) {
  return todos.map(todo => {
    if (todo.id === updatedTodo.id) {
      return {
        ...todo,
        [updatedField]: updatedTodo[updatedField],
      };
    }

    return todo;
  });
}

export const App: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const {
    todosIdToDelete,
    setTodosIdToDelete,
    setTodosIdToUpdate,
  } = useContext(LoadingTodosContext);

  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [isLoadingAddTodo, setIsLoadingAddTodo] = useState(false);

  const formInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!todosIdToDelete.length && !isLoadingAddTodo && formInput.current) {
      formInput.current.focus();
    }
  }, [isLoadingAddTodo, todosIdToDelete]);

  const handleChangeNewTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const notCompletedTodosLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isCompletedAll = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsLoadingAddTodo(true);

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addNewTodo(newTodo)
      .then(response => {
        setNewTodoTitle('');

        return response;
      })
      .then(currentTodo => {
        setTodos((prevState) => [...prevState, currentTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoadingAddTodo(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    setIsLoadingTodos(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  const handelDeleteTodoById = (todoId: number) => {
    setTodosIdToDelete(prevState => [...prevState, todoId]);

    deleteTodoById(todoId)
      .then(() => {
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodosIdToDelete(prevState => prevState.filter(id => id !== todoId));
      });
  };

  const handleChangeCompletedStatus = (
    todoId: number,
    isCompleted: boolean,
  ) => {
    setTodosIdToUpdate(prevState => [...prevState, todoId]);

    updateTodoById(todoId, { completed: !isCompleted })
      .then((currentTodo: Todo) => {
        setTodos(prevState => getUpdatedTodos(
          prevState,
          currentTodo,
          'completed',
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosIdToUpdate(prevState => prevState
          .filter(id => id !== todoId));
      });
  };

  const handleChangeTodoTitle = (
    todoId: number,
    newTitle: string,
  ) => {
    setTodosIdToUpdate(prevState => [...prevState, todoId]);

    updateTodoById(todoId, { title: newTitle })
      .then((currentTodo) => {
        setTodos(prevState => getUpdatedTodos(
          prevState,
          currentTodo,
          'title',
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosIdToUpdate(prevState => prevState
          .filter(id => id !== todoId));
      });
  };

  const handelDeleteCompletedTodos = async () => {
    const completedTodosId = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    await Promise
      .all([...completedTodosId
        .map(id => handelDeleteTodoById(id))]);
  };

  const handleChangeAllCompletedStatus = async () => {
    const todosId = todos
      .filter(({ completed }) => {
        if (!isCompletedAll) {
          return !completed;
        }

        return true;
      })
      .map(({ id }) => id);

    await Promise
      .all([...todosId
        .map(id => handleChangeCompletedStatus(id, isCompletedAll))]);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isTodos={!!todos.length}
          isCompletedAll={isCompletedAll}
          onChangeAllCompletedStatus={handleChangeAllCompletedStatus}
          handelSubmit={handelSubmit}
          newTodoTitle={newTodoTitle}
          onChangeNewTodoTitle={handleChangeNewTodoTitle}
          isLoadingAddTodo={isLoadingAddTodo}
          formInput={formInput}
        />

        {isLoadingTodos ? (
          <Loader />
        ) : (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            onDeleteTodo={handelDeleteTodoById}
            onChangeTitle={handleChangeTodoTitle}
            onChangeCompletedStatus={handleChangeCompletedStatus}
          />
        )}

        {!!todos.length && (
          <Footer
            notCompletedTodosLength={notCompletedTodosLength}
            hasCompletedTodo={hasCompletedTodo}
            onDeleteCompletedTodos={handelDeleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onCloseErrorMessage={setErrorMessage}
      />
    </div>
  );
};

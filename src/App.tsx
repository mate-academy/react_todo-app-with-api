import {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { UserWarning } from './component/UserWarning';
import {
  getTodos, getPostTodos, deleteTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { NewTodo } from './types/NewTodo';
import { TodoHeader } from './component/TodoHeader';
import { TodoFooter } from './component/TodoFooter';
import { SortEnum } from './types/sort';
import { TodoList } from './components/TodoList';

const USER_ID = 10589;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [select, setSelect] = useState(SortEnum.ALL);
  const [error, setError] = useState('');
  const [querySearch, setQuerySearch] = useState('');
  const [processing, setProcessing] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const unCompletedLength = todos.filter(({ completed }) => !completed).length;

  // const addTodoToProcesing = (id : number | null) => {
  //   setProcessing(prev => (!id ? [] : [...prev, id]));
  // };

  const getTodosAll = async () => {
    try {
      setProcessing(prevLoadingTodoIds => [...prevLoadingTodoIds]);
      const receivedTodos = await getTodos(USER_ID);

      setTodos(receivedTodos);
    } catch {
      setError('Failed to load todos');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessing([]);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (select) {
      case SortEnum.ACTIVE:
        return todos.filter(({ completed }) => !completed);

      case SortEnum.ALL:
        return todos;

      case SortEnum.COMPLETED:
        return todos.filter(({ completed }) => completed);

      default:
        return todos;
    }
  }, [todos, select]);

  useEffect(() => {
    getTodosAll();
  }, []);

  const addTodo = async () => {
    const querySearchVerefy = querySearch.trim();

    if (querySearchVerefy.length < 1) {
      return;
    }

    const newTodo: NewTodo = {
      userId: USER_ID,
      completed: false,
      title: querySearch.trim(),
    };

    try {
      const tempId = 0;

      setTempTodo({
        id: tempId,
        ...newTodo,
      });
      setProcessing([tempId]);
      await getPostTodos(USER_ID, newTodo);
      await getTodosAll();
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setProcessing([]);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setProcessing(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);
      await deleteTodos(todoId);
      await getTodosAll();
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setProcessing([]);
    }
  };

  const handleDeleteTodoCompleted = async () => {
    todos.filter(todo => todo.completed)
      .map(todo => handleDeleteTodo(todo.id));
  };

  const handleUpdateStatus = async (id: number) => {
    const updatedTodo = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodo);
    try {
      setProcessing(prevLoadingTodoIds => [...prevLoadingTodoIds, id]);
      const todoToUpdate = todos.find((todo) => todo.id === id);

      if (todoToUpdate) {
        await updateTodo(id, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });
      }
    } catch {
      setError('Unable to override task status');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessing([]);
    }
  };

  const handleUpdateAllTodoStatus = async () => {
    const hasCompleted = todos.some(todo => !todo.completed);

    const updatedAllTodo = todos.map((todo) => {
      if (hasCompleted) {
        return {
          ...todo,
          completed: true,
        };
      }

      return {
        ...todo,
        completed: !todo.completed,
      };
    });

    setTodos(updatedAllTodo);
    try {
      setProcessing(prevLoadingTodoIds => [...prevLoadingTodoIds]);
      if (hasCompleted) {
        todos.forEach(async ({
          id,
        }) => {
          setProcessing(prevIds => [...prevIds]);
          await updateTodo(id, {
            completed: true,
          });
        });
      } else {
        todos.forEach(async ({
          id, completed,
        }) => {
          setProcessing(prevIds => [...prevIds]);
          await updateTodo(id, {
            completed: !completed,
          });
        });
      }
    } catch {
      setError('Unable to override all tasks status');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessing([]);
    }
  };

  const handleUpdateTitle = async (id: number, newTitle: string) => {
    const updatedTodo = todos.map((todo) => {
      if (todo.id === id && newTitle.trim().length > 0) {
        return {
          ...todo,
          title: newTitle.trim(),
        };
      }

      return todo;
    });

    setTodos(updatedTodo);
    try {
      setProcessing(prevIds => [...prevIds, id]);
      const todoToUpdate = todos.find((todo) => todo.id === id);

      if (todoToUpdate) {
        await updateTodo(id, {
          title: newTitle,
          userId: USER_ID,
          id,
        });
      }
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setProcessing([]);
    }
  };

  const handleCleanErrorMessage = useCallback(() => {
    setError('');
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          quarySearch={querySearch}
          setQuarySearch={setQuerySearch}
          addTodo={addTodo}
          handleUpdateAllTodoStatus={handleUpdateAllTodoStatus}
        />
        <TodoList
          tempTodo={tempTodo}
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdateTitle={handleUpdateTitle}
          processing={processing}
        />

        <TodoFooter
          select={select}
          setSelect={setSelect}
          todos={filteredTodos}
          lengTodos={unCompletedLength}
          handleDeleteTodoCompleted={handleDeleteTodoCompleted}
        />
      </div>
      {error && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            type="button"
            className="delete"
            onClick={handleCleanErrorMessage}
            aria-label="delete tode"
          />
          {error}
        </div>
      )}
    </div>
  );
};

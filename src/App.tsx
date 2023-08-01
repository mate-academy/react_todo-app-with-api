/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useEffect,
  useMemo,
  useState,
}
  from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { ErrorMessages } from './utils/ErrorMessages';

const USER_ID = 11219;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [idToDelete, setIdToDelete] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setLoading] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    setErrorMessage(ErrorMessages.NONE);
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DOWNLOADING);
        setTodos([]);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(ErrorMessages.NOT_VALIDE_TITLE);
    }

    const tempTodoData: Todo = {
      id: 0,
      title: query,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempTodoData);

    if (query.trim()) {
      setIsInputDisabled(true);

      addTodo({
        title: query,
        userId: USER_ID,
        completed: false,
      })
        .then((responseTodo) => {
          setTodos((prevTodos) => [...prevTodos, responseTodo]);
          setLoading(false);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.ADD);
        })
        .finally(() => {
          setTempTodo(null);
          setIsInputDisabled(false);
        });
    }
  };

  const deleteItem = (todoId: number) => {
    setLoading(true);
    setIdToDelete([...idToDelete, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DELETE);
      })
      .finally(() => {
        setLoading(false);
        setIdToDelete([]);
      });
  };

  const deleteAllCompletedTodos = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    const deletePromises = completedTodos.map((todo) => deleteItem(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DELETE_ALL);
      });
  };

  const updateTodoStatus = (todoToEdit: Todo) => {
    setLoading(true);

    return updateTodo(todoToEdit)
      .then(() => setTodos(prevTodos => {
        return prevTodos.map(todo => {
          if (todo.id === todoToEdit.id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });
      }))
      .catch(() => {
        setErrorMessage(ErrorMessages.UPDATE);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateAllTodoStatus = () => {
    setLoading(true);
    const makeAllCompleted = !todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: makeAllCompleted,
    }));

    const updatePromises = updatedTodos.map(todo => updateTodoStatus(todo));

    Promise.all(updatePromises)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.TOGGLE);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateTodoTitle = (updatedTodo: Todo) => {
    setTodos(
      (prevTodos) => {
        return prevTodos.map(
          todo => (
            todo.id === updatedTodo.id ? updatedTodo : todo
          ),
        );
      },
    );
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (status) {
          case 'active':
            return !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return true;
        }
      });
  }, [todos, status]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
          isInputDisabled={isInputDisabled}
          todos={todos}
          updateAllTodoStatus={updateAllTodoStatus}
        />

        {todos.length !== 0
        && (
          <TodoList
            filteredTodos={filteredTodos}
            deleteItem={deleteItem}
            isLoading={isLoading}
            setLoading={setLoading}
            idToDelete={idToDelete}
            updateTodoStatus={updateTodoStatus}
            updateTodoTitle={updateTodoTitle}
            setErrorMessage={setErrorMessage}
          />
        )}

        {tempTodo && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
            setStatus={setStatus}
            status={status}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

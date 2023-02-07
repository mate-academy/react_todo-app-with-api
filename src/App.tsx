/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Error } from './components/Error/Error';
import { FilterType } from './components/Enums/FilterType';
import { User } from './types/User';
import { Todo } from './types/Todo';

export const App: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [idsToChange, setIdsToChange] = useState<number[]>([]);
  const handleErrorClose = () => setErrorMessage('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          setErrorMessage('Can\'t load todos');
          setTimeout(handleErrorClose, 3000);
        });
    }
  }, []);

  const addNewTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');
      setTimeout(handleErrorClose, 3000);

      return;
    }

    if (user) {
      try {
        setTempTodo({
          id: 0,
          title,
          userId: user.id,
          completed: false,
        });

        const newTodo = await addTodo(user.id, title);

        setTodos(oldTodos => [...oldTodos, newTodo]);
      } catch {
        setErrorMessage('Unable to add a todo');
      } finally {
        setTempTodo(null);
      }
    }
  };

  const removeTodo = async (todoId: number) => {
    setIdsToChange(current => [...current, todoId]);

    if (user) {
      try {
        await deleteTodo(todoId);

        setTodos(oldTodos => oldTodos.filter(
          todo => todo.id !== todoId,
        ));
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setIdsToChange([]);
      }
    }
  };

  const updateStatusTodo = async (todo: Todo) => {
    setIdsToChange(current => [...current, todo.id]);

    if (user) {
      try {
        const updatedTodo = { ...todo, completed: !todo.completed };

        await updateTodo(todo.id, { completed: !todo.completed });
        setTodos(oldTodos => oldTodos
          .map(element => {
            if (element.id === todo.id) {
              return updatedTodo;
            }

            return element;
          }));
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setIdsToChange([]);
      }
    }
  };

  const editTitleTodo = async (todo: Todo, title: string) => {
    setIdsToChange(current => [...current, todo.id]);

    if (user) {
      try {
        const updatedTodo = { ...todo, title };

        await updateTodo(todo.id, { title });
        setTodos(oldTodos => oldTodos
          .map(element => {
            if (element.id === todo.id) {
              return updatedTodo;
            }

            return element;
          }));
      } catch {
        setErrorMessage('Unable to update title');
      } finally {
        setIdsToChange([]);
      }
    }
  };

  const visibleTodos: Todo[] = useMemo(() => todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [filter, todos]);

  const completedTodos = todos.filter(todo => todo.completed);
  const isAllTodosCompleted: boolean = todos.length === completedTodos.length;

  const toggleAllTodosStatus = () => (
    todos.forEach(todo => (todo.completed === isAllTodosCompleted)
        && updateStatusTodo({ ...todo, completed: isAllTodosCompleted }))
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addNewTodo={addNewTodo}
          toggleAllTodosStatus={toggleAllTodosStatus}
          isAllTodosCompleted={isAllTodosCompleted}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onTodoDelete={removeTodo}
              tempTodo={tempTodo}
              updateStatusTodo={updateStatusTodo}
              idsToChange={idsToChange}
              editTitleTodo={editTitleTodo}
            />
            <Footer
              todos={todos}
              visibleTodos={visibleTodos}
              filter={filter}
              setFilter={setFilter}
              onTodoDelete={removeTodo}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>

      <Error
        error={errorMessage}
        onClick={handleErrorClose}
      />
    </div>
  );
};

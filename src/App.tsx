/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './TodoList/Todolist';
import { Footer } from './Footer/Footer';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import classNames from 'classnames';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setfilterType] = useState('all');
  const [error, setError] = useState<string | null>('');
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [changeAllStatus, setChangeAllStatus] = useState(false)

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const filteredTodos = todos
    .filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        case FilterType.All:
          return todo;
        default:
          return 0;
      }
    });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  userId = 0;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => (setError('Unable to load todo from server')));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('Title can\'t be empty');
      setTitle('');

      return;
    }

    if (!user) {
      return;
    }

    const newTodoAdd = {
      id: 0,
      userId: user.id,
      title,
      completed: false,
    };

    setTodos([...todos, newTodoAdd]);

    try {
      const newTodo = await createTodo(title, userId);

      setTodos([...todos, newTodo]);
    } catch {
      setError('Unable to add a todo');
      setTodos(filteredTodos.filter(todo => todo.id !== 0));
    }

    setTitle('');
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  };

  const handleChangeStatus = async (todoId: number, data: Partial<Todo>) => {

    setSelectedTodo(prevIds => [...prevIds, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, data);
      setTodos(prev => prev.map(todo => (todo.id === todoId
        ? updatedTodo
        : todo)));
    }
    catch {
      setError('Unable to update a todo')}

    finally {
      setSelectedTodo(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const isActive = filteredTodos.filter(todo => !todo.completed);


  const handleChangeStatusAll = async (filteredTodos: Todo[]) => {
    setChangeAllStatus(true);

    try {
      filteredTodos.map(async todo => {
        if (isActive.length) {
          await updateTodo(todo.id, { completed: true });
        } else {
          await updateTodo(todo.id, { completed: false });
        }
      });

      await setTodos((state) => [...state].map(todo => {
        if (isActive.length) {
          return ({
            ...todo,
            completed: true,
          });
        }

        return ({
          ...todo,
          completed: false,
        });
      }));
    }

    catch {
        setError('Unable to update a todo');
    }
    finally {
      setChangeAllStatus(false);
    }
  }


  const handleClickDelete = async (todoId: number) => {
    setSelectedTodo(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currTodos => currTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setSelectedTodo(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', {
              'active' : !isActive.length
            })}
            onClick={()=>handleChangeStatusAll(filteredTodos)}
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          handleClickDelete={handleClickDelete}
          selectedTodo={selectedTodo}
          handleChangeStatus={handleChangeStatus}
          changeAllStatus={changeAllStatus}
        />

        <Footer
          filterType={filterType}
          setfilterType={setfilterType}
          todos={todos}
          handleClickDelete={handleClickDelete}
          isActive={isActive}
        />
      </div>

      {error
        && (
          <ErrorNotification
            error={error}
            setError={setError}
          />
        )}
    </div>
  );
};

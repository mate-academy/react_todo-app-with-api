/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodosByUserId,
  createTodo,
  updateTodo,
} from './Api/todos';
import { TodoList } from './components/TodoList';
import { FilterTodosBy } from './types/FilterTodosBy/FilterTodosBy';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 6998;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState('');
  const [filterBy, setFilterBy] = useState(FilterTodosBy.All);
  const [query, setQuery] = useState('');

  const todosFromServer = useCallback(async (userId: number) => {
    try {
      const result = await getTodosByUserId(userId);

      setTodos(result);
    } catch {
      setHasError('Error to get user from server');
    }
  }, []);

  const changeStatus = async (
    id: number,
    property: Partial<Todo>,
  ) => {
    await updateTodo(id, property);

    setTodos(state => state.map(todo => {
      if (todo.id === id) {
        return { ...todo, ...property };
      }

      return todo;
    }));
  };

  const filteredTodos = todos.filter((todo) => {
    let isStatusCorrect = true;

    switch (filterBy) {
      case FilterTodosBy.Active:
        isStatusCorrect = !todo.completed;
        break;

      case FilterTodosBy.Completed:
        isStatusCorrect = todo.completed;
        break;

      default:
        break;
    }

    return isStatusCorrect;
  });

  useEffect(() => {
    todosFromServer(USER_ID);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const removeTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setHasError('Unable to delete a todo');
      });
  };

  const addTodo = (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    return createTodo(newTodo)
      .then(result => setTodos(state => [...state, result]))
      .catch(() => setHasError('Unable to add a todo'));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setHasError('Title can\'t be empty');

      return;
    }

    addTodo(query);
    setQuery('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          changeStatus={changeStatus}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterBy={setFilterBy}
            filterBy={filterBy}
          />
        )}
      </div>

      <Error
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};

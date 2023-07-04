import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { todosReguests } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { LoadError } from './types/LoadError';
import { FilterType } from './Enums/FilterType';
import { filterTodos } from './utils/filterTodos';
import { NewTodoForm } from './components/NewTodoForm';
import { PostTodo } from './types/PostTodo';

export const USER_ID = 10895;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [loadError, setError] = useState<LoadError>({
    status: false,
    message: '',
  });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const preparedTodos = useMemo(() => (
    filterTodos(todos, filterType)
  ), [filterType, todos]);

  const isTodosExists = todos.length > 0;
  const isDisplayTodos = isTodosExists || tempTodo;

  const fetchTodos = useCallback(async () => {
    try {
      const responce = await todosReguests.getTodos(USER_ID);

      setTodos(responce);
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to load a todos, retry later',
      });
    }
  }, []);

  const addNewTodo = useCallback(async (title: string) => {
    const newTodo: PostTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      const newSuccesfulTodo = await todosReguests.postTodo(newTodo);

      setTempTodo(null);
      setTodos(currentTodos => ([
        ...currentTodos,
        newSuccesfulTodo,
      ]));

      return true;
    } catch (error) {
      setError({
        status: true,
        message: 'Failed to add new Todo, try again...',
      });
      setTempTodo(null);

      return false;
    }
  }, []);

  const removeTodosByID = useCallback(async (todoID: number) => {
    try {
      await todosReguests.deleteTodo(todoID);
      setTodos(current => (
        current.filter(todo => todo.id !== todoID)
      ));
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to delete todos',
      });
    }
  }, []);

  const deleteTodoByID = useCallback(async (id: number) => {
    await removeTodosByID(id);
  }, [removeTodosByID]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const editTodoByID = useCallback(async (
    id: number, data: Partial<Todo>,
  ) => {
    try {
      const result = await todosReguests.editTodo(id, { ...data });

      setTodos((currentTodos) => (
        currentTodos.map(todo => {
          if (todo.id !== result.id) {
            return todo;
          }

          return result;
        })
      ));

      return true;
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to edit todos',
      });

      return false;
    }
  }, []);

  // const editTodosByID = useCallback(async (
  //   ids: number[], data: Partial<Todo>,
  // ) => {
  //   try {
  //     await Promise.all(
  //       ids.map(async (currentId) => {
  //         await editTodo(currentId, { ...data });
  //       }),
  //     );
  //   } catch (error) {
  //     setError({
  //       status: true,
  //       message: 'Unable to edit todos',
  //     });
  //   }
  // }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {isTodosExists && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="Toggle all"
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodoForm
            addNewTodo={addNewTodo}
            setError={setError}
          />
        </header>

        {isDisplayTodos && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            deleteTodoByID={deleteTodoByID}
            editTodoByID={editTodoByID}
          />
        )}

        {isDisplayTodos && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            // removeTodosByID={removeTodosByID}
          />
        )}
      </div>

      <ErrorNotification
        loadError={loadError}
        setError={setError}
      />
    </div>
  );
};

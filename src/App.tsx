import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusFilter } from './types/StatusFilter';
import { TodosHeader } from './components/TodosHeader';
import { TodoList } from './components/TodoList';
import { TodosFooter } from './components/TodosFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterValue, setFilterValue] = useState<StatusFilter>(
    StatusFilter.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsToDel, setTodoIdsToDel] = useState<number[]>([]);
  const [todoIdsToUpdate, setTodoIdsToUpdate] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setTodos(await getTodos());
      } catch (err) {
        setErrorMessage(ErrorMessage.LoadError);
      }
    })();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case StatusFilter.Active:
          return !todo.completed;
        case StatusFilter.Completed:
          return todo.completed;
        case StatusFilter.All:
        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const activeTodosQuantity = useMemo(() => activeTodos.length, [activeTodos]);

  const addNewTodoHandler = async (title: string) => {
    setErrorMessage(null);
    setTempTodo({ title, id: 0, completed: false, userId: USER_ID });
    try {
      const data = await addTodo(title);

      setTodos(prevTodos => [...prevTodos, data]);
    } catch (err) {
      setErrorMessage(ErrorMessage.AddError);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodoHandler = useCallback(async (todoId: number) => {
    setErrorMessage(null);
    setTodoIdsToDel(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(ErrorMessage.DeleteError);
      throw err;
    } finally {
      setTodoIdsToDel(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const clearCompleted = useCallback(() => {
    completedTodos.forEach(todo => {
      return deleteTodoHandler(todo.id);
    });
  }, [completedTodos, deleteTodoHandler]);

  const updateTodoHandler = async (todoToUpd: Todo) => {
    setErrorMessage(null);
    setTodoIdsToUpdate(prevIds => [...prevIds, todoToUpd.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpd);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (err) {
      setErrorMessage(ErrorMessage.UpdateError);
      throw err;
    } finally {
      setTodoIdsToUpdate(prevIds => prevIds.filter(id => id !== todoToUpd.id));
    }
  };

  const handleChangeCompleteAll = async () => {
    if (!!activeTodosQuantity) {
      activeTodos.forEach(todo =>
        updateTodoHandler({ ...todo, completed: true }),
      );
    } else {
      todos.forEach(todo => updateTodoHandler({ ...todo, completed: false }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          addNewTodoHandler={addNewTodoHandler}
          setErrorMessage={setErrorMessage}
          isTempTodo={!!tempTodo}
          todosLength={todos.length}
          handleChangeCompleteAll={handleChangeCompleteAll}
          activeTodosQuantity={activeTodosQuantity}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteTodoHandler={deleteTodoHandler}
              todoIdsToDel={todoIdsToDel}
              todoIdsToUpdate={todoIdsToUpdate}
              updateTodoHandler={updateTodoHandler}
            />
            <TodosFooter
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              hasCompleted={!!completedTodos.length}
              clearCompleted={clearCompleted}
              activeTodosQuantity={activeTodosQuantity}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { Todo } from './types/Todo';
import { List } from './components/List';
import { FilterTodos } from './types/FilterTodos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import * as todoService from './api/todos';
import { Main } from './components/Main';
import { ErrorNotification } from './components/ErrorNotification';
import { getFilteredTodos } from './helper/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState('');
  const [filtredTodos, setFiltredTodos] = useState(FilterTodos.All);
  const [processingTodoId, setProcessingTodoId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setTodosError('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setTodosError('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setTodosError('');
    }, 3000);
  }, [todosError]);

  const isOneTodoCompleted = useMemo(() => (
    todos.some(({ completed }) => completed)
  ), [todos]);

  const filterTodos = useMemo(
    () => getFilteredTodos(todos, filtredTodos), [filtredTodos, todos],
  );

  const handleAddTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: 0,
    });

    try {
      const isDuplicate = todos.some((todo) => todo.title === todoTitle);

      if (isDuplicate) {
        setTodosError('Todo with this title already exists');
      } else {
        const newTitle = await todoService.addTodo(todoTitle);

        setTodos((prevTodo) => [...prevTodo, newTitle]);
      }
    } catch {
      setTodosError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoId((prevTodoIds) => [...prevTodoIds, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setTodosError('Unable to delete a todo');
        throw new Error();
      })
      .finally(() => {
        setProcessingTodoId(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleRenameTodo = (todo: Todo, newTitle: string) => {
    setProcessingTodoId((prevTodoIds) => [...prevTodoIds, todo.id]);

    todoService
      .updateTodo({
        ...todo,
        title: newTitle,
      }).then(updateTodo => {
        setTodos(prevState => prevState.map(curentTodo => (
          curentTodo.id !== updateTodo.id
            ? curentTodo
            : updateTodo
        )));
      })
      .catch(() => {
        setTodosError('Unable to update a todo');
        throw new Error();
      })
      .finally(() => {
        setProcessingTodoId(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setProcessingTodoId((prevTodoIds) => [...prevTodoIds, todo.id]);

    todoService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updateTodo => {
        setTodos(prevState => prevState.map(curentTodo => (
          curentTodo.id !== updateTodo.id
            ? curentTodo
            : updateTodo
        )));
      })
      .catch(() => {
        setTodosError('Unable to togle a todo');
        throw new Error();
      })
      .finally(() => {
        setProcessingTodoId(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (isAllCompleted) {
      todos.forEach(handleToggleTodo);
    } else {
      activeTodos.forEach(handleToggleTodo);
    }
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoAdd={handleAddTodo}
          activeTodosCount={activeTodosCount}
          onAddTodoError={setTodosError}
          onToggle={handleToggleAll}
          isOneTodoCompleted={isOneTodoCompleted}
          todos={filterTodos}
        />

        <List
          filterTodos={filterTodos}
          onTodoDelete={handleDeleteTodo}
          onTodoRename={handleRenameTodo}
          tempTodo={tempTodo}
          isProcessing={processingTodoId}
          onToggleTodo={handleToggleTodo}
        />

        {tempTodo && (
          <Main
            todo={tempTodo}
            tempTodo={null}
            isProcessing={processingTodoId}
            onTodoToggle={async () => handleToggleTodo(tempTodo)}
          />
        )}

        {!!todos.length && (
          <Footer
            isOneTodoCompleted={isOneTodoCompleted}
            todos={filterTodos}
            filtredTodos={filtredTodos}
            setFiltredTodos={setFiltredTodos}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}

        {todosError && (
          <ErrorNotification
            todosError={todosError}
            onAddTodoError={setTodosError}
          />
        )}
      </div>
    </div>
  );
};

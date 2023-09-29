/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
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
        // eslint-disable-next-line no-console
        // console.warn(error);
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

  const isOneTodoCompleted = useMemo(() => todos
    .some(({ completed }) => completed), [todos]);

  const filterTodos = useMemo(() => todos
    .filter(({ completed }) => {
      switch (filtredTodos) {
        case FilterTodos.Active:
          return !completed;
        case FilterTodos.Completed:
          return completed;
        default:
          return true;
      }
    }), [todos, filtredTodos]);

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: 0,
    });

    return todoService
      .addTodo(todoTitle)
      .then((newTitle) => {
        setTodos((prevTodo) => [...prevTodo, newTitle]);
      })
      .catch(() => {
        setTodosError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
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
        id: todo.id,
        title: newTitle,
        userId: todo.userId,
        completed: todo.completed,
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
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
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
        />

        <List
          filterTodos={filterTodos}
          onTodoDelete={handleDeleteTodo}
          onTodoRename={handleRenameTodo}
          tempTodo={tempTodo}
          isProcessing={processingTodoId}
          onToggleTodo={handleToggleTodo}
        />

        {isOneTodoCompleted && (
          <Footer
            isOneTodoCompleted={isOneTodoCompleted}
            todos={filterTodos}
            filtredTodos={filtredTodos}
            setFiltredTodos={setFiltredTodos}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !todosError.length,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodosError('')}
        />
        {/* show only one message at a time */}
        {todosError}
        {/* <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
      </div>
    </div>
  );
};

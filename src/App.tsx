import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { ForComletedTodo } from './types/enumFilter';
import { TodoItem } from './Components/TodoItem';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [condition, setCondition] = useState(ForComletedTodo.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (errorTimer) {
      clearTimeout(errorTimer);
    }

    setErrorTimer(setTimeout(() => {
      setErrorMessage(null);
    }, 3000));
  }, [errorMessage, errorTimer]);

  const hasTodos = !!todos.length;

  const isAllCompleted = todos.every(todo => todo.completed);

  const fetchData = useCallback(async () => {
    try {
      setErrorMessage(null);
      const todosFetch = await todoService.getTodos();

      setTodos(todosFetch);
    } catch (err) {
      setErrorMessage('Unable to load todos');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const hadleAddTodo = async (title: string) => {
    try {
      setInputDisabled(true);

      const newTodo = {
        id: 0,
        userId: 0,
        title: title.trim(),
        completed: false,
      };

      setTempTodo(newTodo);

      const addedTodo = await todoService.addTodo(title);

      setTodos((prevTodos) => [...prevTodos, addedTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setInputDisabled(false);
      setTempTodo(null);
    }
  };

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (condition) {
      case ForComletedTodo.Active:
        return !completed;
      case ForComletedTodo.Completed:
        return completed;
      default:
        return 1;
    }
  }), [condition, todos]);

  const handleDeleteTodo = (todoId: number) => {
    setInputDisabled(true);
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        setInputDisabled(false);
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleRenameTodo = async (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

    return todoService.updateTodo({
      id: todo.id,
      title: newTodoTitle.trim(),
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        throw new Error('Unable to update a todo');
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleClearCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

      const updatedTodo = await todoService.updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prevState => prevState.map(currentTodo => (
        currentTodo.id !== updatedTodo.id
          ? currentTodo
          : updatedTodo
      )));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoIds(
        (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
      );
    }
  };

  const handleToggleAllTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (isAllCompleted) {
      todos.forEach(handleToggleTodo);
    } else {
      activeTodos.forEach(handleToggleTodo);
    }
  };

  const handleDelete = async (todoId: number) => {
    return handleDeleteTodo(todoId);
  };

  const handleRename = async (todo: Todo, todoTitle: string) => {
    await handleRenameTodo(todo, todoTitle);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoAddError={setErrorMessage}
          isAllCompleted={isAllCompleted}
          hasTodos={hasTodos}
          onTodoAdd={hadleAddTodo}
          inputDisabled={inputDisabled}
          onToggleAll={handleToggleAllTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleDelete(todo.id)}
              onRenameTodo={(todoTitle) => handleRename(todo, todoTitle)}
              onTodoToggle={() => handleToggleTodo(todo)}
              isProcessing={processingTodoIds.includes(todo.id)}
            />
          ))}
        </section>

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isProcessing
          />
        )}

        {hasTodos && (
          <Footer
            todos={todos}
            condition={condition}
            setCondition={setCondition}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        errorTimer={errorTimer}
        setErrorTimer={setErrorTimer}
      />
    </div>
  );
};

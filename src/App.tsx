/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodosError } from './types/TodosError';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { TodosSortType } from './types/TodosSortType';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const filteredTodos = (todos: Todo[], filterStatus: TodosSortType): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterStatus) {
      case TodosSortType.Completed:
        return todo.completed;
      case TodosSortType.Active:
        return !todo.completed;
      default:
        return 1;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todosSortBy, setTodosSortBy] = useState(TodosSortType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const trimmedTitle = todoTitle.trim();

  const visibleTodos = useMemo(() => (
    filteredTodos(todos, todosSortBy)
  ), [todos, todosSortBy]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch((error) => {
        setErrorMessage(TodosError.DOWNLOAD_ERROR_MESSAGE);
        throw error;
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (inputTitle: string) => {
    return todoService
      .addTodo(inputTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(TodosError.ADD_ERROR_MESSAGE);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds(prev => [...prev, todoId]);

    todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
        setTodoTitle('');
      }))
      .catch((error) => {
        setErrorMessage(TodosError.DELETE_ERROR_MESSAGE);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds(prev => [...prev, todo.id]);

    return todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
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
      .catch((error) => {
        setErrorMessage(TodosError.UPDATE_ERROR_MESSAGE);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const updateTodoStatus = (todo: Todo) => {
    todoService.updateTodo({ ...todo, completed: !todo.completed }).then(updatedTodo => {
      setTodos(prevState => prevState.map(currentTodo => (
        currentTodo.id !== updatedTodo.id
          ? currentTodo
          : updatedTodo
      )));
    })
      .catch((error) => {
        setErrorMessage(TodosError.UPDATE_ERROR_MESSAGE);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Omit<Todo, 'id'> = {
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    if (!trimmedTitle) {
      setErrorMessage(TodosError.TITLE_EMPTY_ERROR);

      return;
    }

    handleAddTodo(newTodo.title)
      .then(() => {
        setTodoTitle('');
      })
      .catch();
    setTempTodo({ ...newTodo, id: 0 });
  };

  const completedTodos = visibleTodos
    .filter(({ completed }) => completed);

  const clearAllCompleted = () => {
    completedTodos.forEach(({ id }) => handleDeleteTodo(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todoTitle={todoTitle}
          onTodoTitle={handleTodoTitle}
          onSubmit={handleSubmit}
        />

        <section className="todoapp__main" data-cy="TodoList">

          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDeleteTodo={() => handleDeleteTodo(todo.id)}
              onTodoUpdate={
                (newTodoTitle) => handleUpdateTodo(todo, newTodoTitle)
              }
              isProcessing={processingTodoIds.includes(todo.id)}
              updateTodoStatus={updateTodoStatus}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        <Footer
          onSortByField={setTodosSortBy}
          todosSortBy={todosSortBy}
          completedTodosLength={completedTodos.length}
          clearAllCompleted={clearAllCompleted}
          todosLength={visibleTodos.length}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

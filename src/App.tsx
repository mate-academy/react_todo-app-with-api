/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import {
  addTodo, changeTodo, deleteTodo, getTodos,
} from './api/todos';
import { Header } from './components/Header';
import { TodoStatus } from './types/TodoStatus';
import { Footer } from './components/Footer';
import { TodoItem } from './components/Todo';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState(TodoStatus.All);
  const [clearCompleted, setClearCompleted] = useState(false);
  const [processedTodo, setProcessedTodo] = useState<number[]>([0]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => todos.length - activeTodos,
    [activeTodos]);

  const todosLength = useMemo(() => todos.length, [todos]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorMessages.TodosWereNotLoaded));
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TitleIsEmpty);

      return;
    }

    if (user) {
      setIsAdding(true);
      setTempTodo({
        id: 0,
        userId: user.id,
        title,
        completed: false,
      });

      addTodo(title, user?.id)
        .then((newTodo) => {
          setTodos((prevTodos) => ([
            ...prevTodos,
            newTodo,
          ]));

          setTitle('');
        })
        .catch(() => setErrorMessage(ErrorMessages.TodoIsNotAdded))
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
          setTitle('');
        });
    }
  };

  const handleDeleteTodo = (id: number) => {
    setProcessedTodo(todosId => [...todosId, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos((listOfTodos) => (
          listOfTodos.filter(todo => todo.id !== id)));
      })
      .catch(() => setErrorMessage(ErrorMessages.TodoIsNotDeleted))
      .finally(() => setProcessedTodo(todosId => (
        todosId.filter(todoId => todoId !== id))));
  };

  const handleChangeTodo = (
    id: number,
    caption: string,
    changeCompletedStatus = true,
  ) => {
    setProcessedTodo(todosId => [...todosId, id]);

    changeTodo(id, caption).then(() => {
      setTodos((listOfTodos) => (
        listOfTodos.map(todo => {
          return todo.id === id
            ? {
              ...todo,
              title: caption,
              completed: changeCompletedStatus
                ? !todo.completed
                : todo.completed,
            }
            : todo;
        })));
    })
      .catch(() => setErrorMessage(ErrorMessages.TodoIsNotUpdates))
      .finally(() => setProcessedTodo(todosId => (
        todosId.filter(todoId => todoId !== id))));
  };

  const toggleAll = () => {
    const toggleStatus = todosLength === completedTodos;

    todos.forEach(todo => {
      const { id, title: caption, completed } = todo;

      if (completed === toggleStatus) {
        handleChangeTodo(id, caption);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAdding={isAdding}
          todosLength={todosLength}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          onToggle={toggleAll}
          completedTodos={completedTodos}
        />

        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          filterStatus={filterStatus}
          clearCompleted={clearCompleted}
          changeTodo={handleChangeTodo}
          processedTodo={processedTodo}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isAdding={isAdding}
            clearCompleted={clearCompleted}
            changeTodo={handleChangeTodo}
            processedTodo={processedTodo}
          />
        )}

        {!!todosLength && (
          <Footer
            onStatusChange={setFilterStatus}
            status={filterStatus}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onClear={setClearCompleted}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};

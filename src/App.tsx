import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  getTodos, deleteTodo, createTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToUpdate, setTodosToUpdate] = useState<Todo[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => (setErrorMessage('Unable to load a todos')));
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onFilterTypeBotton = useCallback((filterTypeButton: string) => {
    setFilterType(filterTypeButton);
  }, [filterType]);

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      setErrorMessage('Title can not be empty');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        title: todoTitle,
        completed: false,
        userId: user.id,
      });

      setIsLoading(true);
      createTodo({ title: todoTitle, completed: false, userId: user.id })
        .then(response => {
          setTodos(prev => [...prev, {
            id: response.id,
            title: response.title,
            completed: response.completed,
            userId: response.userId,
          }]);
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
          setTodoTitle('');
        });
    }
  };

  const onDeleteTodo = useCallback((id: number) => {
    deleteTodo(id)
      .then(() => (
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== id))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }, [todos]);

  const onUpdateTodo = useCallback((chosenTodo: Todo) => {
    setTodosToUpdate(prev => [...prev, chosenTodo]);

    updateTodo(chosenTodo.id, {
      title: chosenTodo.title, completed: chosenTodo.completed,
    })
      .then((udpatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id !== udpatedTodo.id
            ? todo
            : {
              id: udpatedTodo.id,
              userId: udpatedTodo.userId,
              title: udpatedTodo.title,
              completed: udpatedTodo.completed,
            }
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosToUpdate([]);
      });
  }, [todos]);

  const onToggleAll = useCallback(() => {
    setIsLoading(true);
    const isAllTodosCompleter = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      const isNeedToUpdate = !isAllTodosCompleter && !todo.completed;

      if (isNeedToUpdate || isAllTodosCompleter) {
        onUpdateTodo({ ...todo, completed: !todo.completed });
      }
    });
    setIsLoading(false);
  }, [todos]);

  const onClickClearCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  }, [todos]);

  let visibleTodos = todos;

  if (filterType === 'Active') {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (filterType === 'Completed') {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  const todosLeft = useMemo(() => visibleTodos.filter(
    todo => !todo.completed,
  ), [visibleTodos]);

  const todosCompleted = useMemo(() => visibleTodos.filter(
    todo => todo.completed,
  ).length, [visibleTodos]);

  const toggledAlltodos = visibleTodos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          onToggleAll={onToggleAll}
          toggledAlltodos={toggledAlltodos}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              isLoading={isLoading}
              todosToUpdate={todosToUpdate}
              onUpdateTodo={onUpdateTodo}
            />
            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                isLoading={isLoading}
                onDeleteTodo={onDeleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            )}
            <Footer
              filterTodos={filterType}
              todosLeft={todosLeft}
              todosCompleted={todosCompleted}
              onFilterTypeBotton={onFilterTypeBotton}
              onClickClearComplited={onClickClearCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

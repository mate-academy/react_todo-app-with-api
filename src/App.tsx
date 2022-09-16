/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
import { TodoItem } from './components/Todo/TodoItem';
import { TodoFooter } from './components/Todo/TodoFooter';
import { ErrorNotification } from './components/Todo/ErrorNotification';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';
import { PatchTodoFragment } from './types/TodoFragment';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const userId: number = user ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosForRender, setTodoForRender] = useState<Todo[]>(todos);
  const [areTodosLoading, setAreTodosLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);
  const [filterOption, setFilterOption] = useState('All');

  const [error, setError] = useState('');

  useEffect(() => {
    setAreTodosLoading(true);

    getTodos(userId)
      .then((posts) => {
        setTodos(posts);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
      .finally(() => setAreTodosLoading(false));
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [inputVal]);

  useEffect(() => {
    setTodoForRender(todos);
    switch (filterOption) {
      case 'Active':
        setTodoForRender(prevState => prevState.filter(
          todo => !todo.completed,
        ));
        break;

      case 'Completed':
        setTodoForRender(prevState => prevState.filter(todo => todo.completed));

        break;
      default:
        setTodoForRender(todos);
    }
  }, [filterOption, todos]);

  const addTodo = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const optimisticResponseId = -(todos.length);

    const optimisticTodo = {
      id: optimisticResponseId,
      title: inputVal,
      userId: user.id,
      completed: false,
    };

    setTodos(prevTodos => [...prevTodos, optimisticTodo]);
    setActiveTodoId(prevState => [...prevState, optimisticResponseId]);

    try {
      const createdTodo = await postTodo({
        title: inputVal,
        userId: user.id,
        completed: false,
      });

      setTodos(prevState => prevState.map(todo => {
        if (todo.id === optimisticResponseId) {
          return createdTodo;
        }

        return todo;
      }));
    } catch {
      setTodos(prevState => prevState
        .filter(todo => todo.id !== optimisticResponseId));
      setError('Unable to add a todo');
      setTimeout(() => (setError('')), 3000);
    }

    setActiveTodoId(prevState => prevState.filter(
      item => item === optimisticResponseId,
    ));
  }, [inputVal]);

  const removeTodo = useCallback(async (todoId: number) => {
    setActiveTodoId(prevState => [...prevState, todoId]);

    if (!user) {
      return;
    }

    try {
      await deleteTodo(todoId);
      setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTimeout(() => (setError('')), 3000);
    }

    setActiveTodoId(prevState => prevState.filter(item => item === todoId));
  }, []);

  const changeTodo = useCallback(async (
    todoId: number, patchFragment: PatchTodoFragment,
  ) => {
    setActiveTodoId(prevState => [...prevState, todoId]);
    const { title, completed } = patchFragment;

    try {
      const updatedTodo = await patchTodo(todoId, { title, completed });

      setTodos(prevState => prevState.map(todo => {
        if (todo.id === todoId) {
          return updatedTodo;
        }

        return todo;
      }));
    } catch {
      setError('Unable to update a todo');
      setTimeout(() => (setError('')), 3000);
    }

    setActiveTodoId(prevState => prevState.filter(item => item !== todoId));
  }, []);

  const toggleAllHandler = useCallback(() => {
    if (todosForRender.every(todo => todo.completed)) {
      todosForRender.forEach(todo => changeTodo(
        todo.id, { completed: !todo.completed },
      ));
    }

    if (todosForRender.some(todo => !todo.completed)) {
      todosForRender.forEach(todo => {
        if (!todo.completed) {
          changeTodo(todo.id, { completed: !todo.completed });
        }
      });
    }
  },
  [todosForRender]);

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={todosForRender.every(todo => todo.completed)
                ? 'todoapp__toggle-all active'
                : 'todoapp__toggle-all'}
              onClick={toggleAllHandler}
            />

            <form onSubmit={(event) => {
              addTodo(event);
              setInputVal('');
            }}
            >
              <input
                data-cy="NewTodoField"
                type="text"
                ref={newTodoField}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.trimStart())}
              />
            </form>
          </header>
          {!areTodosLoading && (
            <section className="todoapp__main" data-cy="TodoItem">
              {todosForRender.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  removeTodo={removeTodo}
                  changeTodo={changeTodo}
                  activeTodo={activeTodoId}
                />
              ))}
              {todos.length > 0 && (
                <TodoFooter
                  filterOption={filterOption}
                  setFilterOption={setFilterOption}
                  todosForRender={todosForRender}
                  removeTodo={removeTodo}
                />
              )}
            </section>
          )}
        </div>
        <ErrorNotification
          hasError={error}
        />
      </div>
    </AuthProvider>
  );
};

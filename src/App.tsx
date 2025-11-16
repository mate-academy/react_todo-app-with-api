/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/todoItem';
import { Error } from './components/Error/errorMessage';
import { FilterEnum, Footer } from './components/Footer/footer';
import { Header } from './components/Header/header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [waitForResponseToggleTodo, setWaitForResponseToggleTodo] =
    useState(false);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.all);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | null>(todos);
  const [value, setValue] = useState('');
  const [countOfTodos, setCountOfTodos] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [waitingDelete, setWaitingDelete] = useState(false);
  const [todoWaitDeleteId, setTodoWaitDeleteId] = useState<number | null>(null);
  const [toggleTodoId, setToggleTodoId] = useState<number | null>(null);
  const [onChangeGetTodos, setOnChangeGetTodos] = useState(0);
  const [waitForToggle, setWaitForToggle] = useState(false);
  const [updateFormNeeded, setUpdateFormNeeded] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [activeChangeTodoId, setActiveChangeTodoId] = useState<number | null>(
    null,
  );
  const [loadingChangeTodoTitle, setLoadingChangeTodoTitle] = useState(false);
  // prettier-ignore
  // eslint-disable-next-line max-len
  const [loadingChangeTodoTitleId, setLoadingChangeTodoTitleId] = useState<number | null>(null);

  const [titleWasChanged, setTitleWasChanged] = useState(false);

  const setError = (text: string, duration = 3000): void => {
    setErrorMessage(text);
    setTimeout(() => setErrorMessage(null), duration);
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setError('Unable to load todos');
      }
    }

    fetchTodos();
  }, [onChangeGetTodos]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (filter && todos) {
      switch (filter) {
        case FilterEnum.all:
          setFilteredTodos(todos);
          break;
        case FilterEnum.active:
          setFilteredTodos(todos.filter(todo => !todo.completed));
          break;
        case FilterEnum.completed:
          setFilteredTodos(todos.filter(todo => todo.completed));
          break;
        default:
          setFilteredTodos(todos);
          break;
      }
    }
  }, [filter, todos]);

  useEffect(() => {
    if (!todos) {
      return;
    }

    setCountOfTodos(todos.filter(todo => !todo.completed).length | 0);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function toggleTodoCompleted(todoId: number) {
    setWaitForResponseToggleTodo(true);
    setToggleTodoId(todoId);
    setWaitForResponseToggleTodo(true);

    async function toggleTodo() {
      try {
        const todo = todos?.find(t => t.id === todoId);

        await updateTodo(todoId, {
          completed: !todo?.completed,
        });

        return setTodos(prevTodos => {
          if (!prevTodos) {
            return prevTodos;
          }

          return prevTodos.map(todoElement =>
            todoElement.id === todoId
              ? { ...todoElement, completed: !todoElement.completed }
              : todoElement,
          );
        });
      } catch (error) {
        setError('Unable to update a todo');
      } finally {
        setWaitForResponseToggleTodo(false);
        setToggleTodoId(null);
        setWaitForResponseToggleTodo(false);
      }
    }

    return toggleTodo();
  }

  async function handleToggleAll() {
    if (!todos?.length) {
      return;
    }

    setWaitForToggle(true);

    try {
      if (countOfTodos > 0) {
        const activeTodos = todos.filter(todo => !todo.completed);

        await Promise.allSettled(
          activeTodos.map(todo => toggleTodoCompleted(todo.id)),
        );
      } else {
        await Promise.allSettled(
          todos.map(todo => toggleTodoCompleted(todo.id)),
        );
      }

      setOnChangeGetTodos(prev => prev + 1);
    } catch (error) {
      setError('Unable to toggle todos');
    } finally {
      setWaitForToggle(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();

    if (trimmed.length <= 0) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({ id: 0, title: trimmed, completed: false, userId: USER_ID });
    setWaiting(true);
    setIsProcessed(true);
    async function postTodo() {
      try {
        const todoFromServer = await createTodo(trimmed);

        setIsProcessed(false);
        setTodos(prev => (prev ? [...prev, todoFromServer] : [todoFromServer]));
        setValue('');
      } catch (error) {
        setError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setWaiting(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }

    postTodo();
  }

  function handleDelete(todoId: number) {
    async function rmTodo() {
      setWaitingDelete(true);
      setTodoWaitDeleteId(todoId);
      try {
        const response = await deleteTodo(todoId);

        setTodos(prev =>
          prev ? prev.filter(todo => todo.id !== todoId) : prev,
        );

        return response;
      } catch (error) {
        setErrorMessage('Unable to delete a todo');

        return;
      } finally {
        setWaitingDelete(false);
        setTodoWaitDeleteId(null);
      }
    }

    return rmTodo();
  }

  async function handleClearCompleted() {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    setTodos(
      prev =>
        prev?.filter(todo => {
          if (!todo.completed) {
            return true;
          }

          const index = completedTodos.findIndex(t => t.id === todo.id);

          return results[index].status === 'rejected';
        }) || [],
    );

    if (results.some(r => r.status === 'rejected')) {
      setError('Unable to delete a todo');
    }

    inputRef.current?.focus();
  }

  const handleDoubleClick = (todoId: number) => {
    setUpdateFormNeeded(true);
    setActiveChangeTodoId(todoId);
  };

  const handleTodoTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!updateFormNeeded || (todos ?? [])?.length < 1) {
      return;
    }

    setTitleWasChanged(true);
    setUpdatedTitle(event.target.value);
  };

  const handleTitleChangeSubmit = async (
    event: FormEvent<HTMLFormElement> | null,
    todoId: number,
  ) => {
    if (event) {
      event.preventDefault();
    }

    let error = false;

    if (!updateFormNeeded || (todos ?? [])?.length < 1) {
      error = true;
    }

    const oldTodo = todos?.find(todo => todo.id === todoId);

    if (!oldTodo || oldTodo.title === updatedTitle || !titleWasChanged) {
      error = true;
    }

    if (updatedTitle === '' && !error) {
      try {
        setLoadingChangeTodoTitle(true);
        setLoadingChangeTodoTitleId(todoId);

        await deleteTodo(todoId);

        setTodos(prev => (prev ? prev.filter(t => t.id !== todoId) : prev));

        setUpdateFormNeeded(false);
        setActiveChangeTodoId(null);
        setUpdatedTitle('');
        setTitleWasChanged(false);
      } catch {
        setError('Unable to delete a todo');
      } finally {
        setLoadingChangeTodoTitle(false);
        setLoadingChangeTodoTitleId(null);
      }

      return;
    }

    if (error) {
      setUpdateFormNeeded(false);
      setActiveChangeTodoId(null);
      setUpdatedTitle('');
      setTitleWasChanged(false);
    }

    if (!error) {
      try {
        setLoadingChangeTodoTitle(true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setLoadingChangeTodoTitleId(oldTodo.id);
        await updateTodo(todoId, { title: updatedTitle.trim() });

        // prettier-ignore
        setTodos(prev =>
          prev
            ? prev.map(todo =>
              // eslint-disable-next-line max-len
              todo.id === todoId ? { ...todo, title: updatedTitle.trim() } : todo,
            ) : prev,
        );

        setTitleWasChanged(false);
        setUpdateFormNeeded(false);
        setUpdatedTitle('');
        setActiveChangeTodoId(null);
      } catch (e) {
        setError('Unable to update a todo');
      } finally {
        setLoadingChangeTodoTitleId(null);
        setLoadingChangeTodoTitle(false);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setLoadingChangeTodoTitleId(null);
      setLoadingChangeTodoTitle(false);
      setUpdateFormNeeded(false);
      setUpdatedTitle('');
      setTitleWasChanged(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          value={value}
          setValue={setValue}
          waiting={waiting}
          inputRef={inputRef}
          countOfTodos={countOfTodos}
          handleToggleAll={handleToggleAll}
          waitForToggle={waitForToggle}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos?.map((todo: Todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                waitForResponseToggleTodo={waitForResponseToggleTodo}
                toggleTodoCompleted={toggleTodoCompleted}
                isProcessed={isProcessed}
                handleDelete={handleDelete}
                waitingDelete={waitingDelete}
                todoWaitDeleteId={todoWaitDeleteId}
                inputRef={inputRef}
                toggleTodoId={toggleTodoId}
                waitForToggle={waitForToggle}
                handleDoubleClick={handleDoubleClick}
                updateFormNeeded={updateFormNeeded}
                handleTodoTitleInputChange={handleTodoTitleInputChange}
                handleTitleChangeSubmit={handleTitleChangeSubmit}
                activeChangeTodoId={activeChangeTodoId}
                loadingChangeTodoTitle={loadingChangeTodoTitle}
                loadingChangeTodoTitleId={loadingChangeTodoTitleId}
                handleKeyDown={handleKeyDown}
              />
            );
          })}
          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              waitForResponseToggleTodo={true}
              toggleTodoCompleted={toggleTodoCompleted}
              isProcessed={isProcessed}
              handleDelete={handleDelete}
              waitingDelete={waitingDelete}
              todoWaitDeleteId={todoWaitDeleteId}
              inputRef={inputRef}
              toggleTodoId={toggleTodoId}
              waitForToggle={waitForToggle}
              handleDoubleClick={handleDoubleClick}
              updateFormNeeded={updateFormNeeded}
              handleTodoTitleInputChange={handleTodoTitleInputChange}
              handleTitleChangeSubmit={handleTitleChangeSubmit}
              activeChangeTodoId={activeChangeTodoId}
              loadingChangeTodoTitle={loadingChangeTodoTitle}
              loadingChangeTodoTitleId={loadingChangeTodoTitleId}
              handleKeyDown={handleKeyDown}
            />
          )}
        </section>

        {todos && todos.length > 0 && (
          <Footer
            countOfTodos={countOfTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
            completedTodos={todos ? todos.filter(todo => todo.completed) : []}
          />
        )}
      </div>

      <Error errorMsg={errorMessage} />
    </div>
  );
};

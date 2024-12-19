/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TempTodo } from './components/TempTodo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFilter } from './types/TodoFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [loadingTodoIdS, setLoadingTodoIdS] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  const completedTodosID = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
  const notCompletedTodosID = todos
    .filter(todo => !todo.completed)
    .map(todo => todo.id);

  //#region effects
  useEffect(() => {
    if (errorMessage.length !== 0) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    setIsTodoLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(`Unable to load todos`))
      .finally(() => setIsTodoLoading(false));
  }, []);
  //#endregion

  //#region filter Todos
  const [selectedFilter, setSelectedFilter] = useState<TodoFilter>(
    TodoFilter.All,
  );

  function getVisibleTodos() {
    let visibleTodos: Todo[];

    switch (selectedFilter) {
      case TodoFilter.All:
        visibleTodos = todos;
        break;
      case TodoFilter.Active:
        visibleTodos = todos.filter(todo => !todo.completed);
        break;
      case TodoFilter.Completed:
        visibleTodos = todos.filter(todo => todo.completed);
        break;
    }

    return visibleTodos;
  }
  //#endregion

  //#region focus change
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [todos, isTodoLoading, tempTodo]);

  const redactingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    redactingInputRef.current?.focus();
  }, [selectedTodo]);
  //#endregion

  //#region add Todos
  const [query, setQuery] = useState('');

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setIsTodoLoading(true);
    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: query.trim(),
      completed: false,
    });

    return todoService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currTodos => [...currTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        titleRef.current?.focus();
        throw error;
      })
      .finally(() => {
        setIsTodoLoading(false);
        setTempTodo(null);
      });
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: query.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    addTodo(newTodo).then(() => setQuery(''));
  }
  //#endregion

  //#region delete Todos and clear completed todos
  function deleteTodos(todoId: Todo['id']) {
    setLoadingTodoIdS([todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIdS([]);
      });
  }

  function handleClearCompleted() {
    setLoadingTodoIdS(completedTodosID);
    completedTodosID.forEach(id =>
      todoService
        .deleteTodo(id)
        .then(() => {
          setTodos(currTodos => currTodos.filter(tod => !tod.completed));
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => setLoadingTodoIdS([])),
    );
  }
  //#endregion

  //#region toggle Todos
  function toggleTodo(currentTodo: Todo) {
    setLoadingTodoIdS([currentTodo.id]);
    todoService
      .updateTodo({ ...currentTodo, completed: !currentTodo.completed })
      .then(updTodo => {
        setTodos(
          todos.map(todo => (todo.id === currentTodo.id ? updTodo : todo)),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIdS([]);
      });
  }

  function toggleAll() {
    const areAllCompleted = todos.every(t => t.completed);
    const completedTodos = todos.filter(t => t.completed);
    const notCompletedTodos = todos.filter(t => !t.completed);

    if (areAllCompleted) {
      setLoadingTodoIdS(completedTodosID);
      completedTodos.forEach(todo => {
        todoService
          .updateTodo({ ...todo, completed: false })
          .then(updatedTodo => {
            setTodos(currTodos =>
              currTodos.map(currTodo =>
                currTodo.id === todo.id ? updatedTodo : currTodo,
              ),
            );
          })
          .catch(error => {
            setErrorMessage('Unable to update a todo');
            throw error;
          })
          .finally(() => {
            setLoadingTodoIdS([]);
          });
      });
    } else {
      setLoadingTodoIdS(notCompletedTodosID);
      notCompletedTodos.forEach(todo => {
        todoService
          .updateTodo({ ...todo, completed: true })
          .then(updatedTodo => {
            setTodos(currTodos =>
              currTodos.map(currTodo =>
                currTodo.id === todo.id ? updatedTodo : currTodo,
              ),
            );
          })
          .catch(error => {
            setErrorMessage('Unable to update a todo');
            throw error;
          })
          .finally(() => {
            setLoadingTodoIdS([]);
          });
      });
    }
  }
  //#endregion

  //#region rename Todo
  const [redactingQuery, setRedactingQuery] = useState(selectedTodo?.title);

  function handleSelectTodoSpan(ev: React.MouseEvent<HTMLSpanElement>) {
    const selectedTodoTitle = ev.currentTarget.textContent;

    setRedactingQuery(selectedTodoTitle?.trim());

    setSelectedTodo(todos.find(t => t.title === selectedTodoTitle));
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setSelectedTodo(undefined);
      redactingInputRef.current?.blur();
      titleRef.current?.focus();
    }
  }

  document.addEventListener('keyup', handleEscape);

  function handleTitleChange(todoToUpdate: Todo) {
    if (todoToUpdate.title.trim() === redactingQuery?.trim()) {
      setSelectedTodo(undefined);
      redactingInputRef.current?.blur();
      titleRef.current?.focus();

      return;
    }

    setLoadingTodoIdS([todoToUpdate.id]);

    todoService
      .updateTodo({
        ...todoToUpdate,
        title: redactingQuery?.trim(),
      })
      .then(updatedTodo => {
        if (!updatedTodo.title) {
          setLoadingTodoIdS([]);
          deleteTodos(updatedTodo.id);

          return;
        }

        return setTodos(currTodos =>
          currTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setLoadingTodoIdS([]));
  }

  function handleTitleChangeSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    handleTitleChange(selectedTodo);
  }
  //#endregion

  //#region user warning
  if (!todoService.USER_ID) {
    return <UserWarning />;
  }
  //#endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onToggleAll={toggleAll}
          onSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
          isTodoLoading={isTodoLoading}
          loadingTodoIdS={loadingTodoIdS}
          titleRef={titleRef}
        />

        {!!todos.length && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={getVisibleTodos()}
              onToggle={toggleTodo}
              selectedTodo={selectedTodo}
              onTitleChange={handleTitleChangeSubmit}
              redactingInputRef={redactingInputRef}
              redactingQuery={redactingQuery}
              setRedactingQuery={setRedactingQuery}
              onTodoSelect={handleSelectTodoSpan}
              onDelete={deleteTodos}
              loadingTodoIdS={loadingTodoIdS}
            />

            {tempTodo && <TempTodo tempTodo={tempTodo} />}
          </section>
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};

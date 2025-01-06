/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { useRef } from 'react';
import { Filter } from './types/Filter';
import classNames from 'classnames';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage, sendErrorMessage } from './components/ErrorsUnderFooter';
import { TodoList } from './components/TodoList';
import { TempTodo } from './components/TempTodo';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const [toogleAllTodos, setToogleAllTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodoList(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, deletingTodos]);

  const filterTodos = useMemo(() => {
    switch (selectedFilter) {
      case Filter.Active:
        return todoList.filter(todo => !todo.completed);
      case Filter.Completed:
        return todoList.filter(todo => todo.completed);
      case Filter.All:
      default:
        return todoList;
    }
  }, [todoList, selectedFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleCompletion = (todoId: number) => {
    const todoToUpdate = todoList.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    setDeletingTodos(prev => [...prev, todoId]);

    updateTodo(updatedTodo)
      .then(todoFromApi => {
        setTodoList(prevTodos =>
          prevTodos.map(todo => (todo.id === todoId ? todoFromApi : todo)),
        );
      })
      .catch(() => {
        sendErrorMessage('Unable to update a todo', setErrorMessage);
      })
      .finally(() => {
        setDeletingTodos(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const submitTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      sendErrorMessage('Title should not be empty', setErrorMessage);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoader(true);

    postTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(data => {
        setTodoList(preTodoList => [...preTodoList, data]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        sendErrorMessage('Unable to add a todo', setErrorMessage);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodoList(prevTodoList =>
        prevTodoList.filter(todo => todo.id !== todoId),
      );
    } catch (error) {
      sendErrorMessage('Unable to delete a todo', setErrorMessage);

      throw error;
    } finally {
      setDeletingTodos(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedTodo = async () => {
    const completedTodoIds = todoList
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodos(prev => [...prev, ...completedTodoIds]);

    let hasError = false;

    for (const id of completedTodoIds) {
      try {
        await deleteTodo(id);
        setTodoList(prev => prev.filter(todo => todo.id !== id));
      } catch {
        hasError = true;
      }
    }

    setDeletingTodos(prev => prev.filter(id => !completedTodoIds.includes(id)));

    if (hasError) {
      sendErrorMessage('Unable to delete a todo', setErrorMessage);
    }
  };

  const handleToogleAll = async () => {
    const completedAll = todoList.every(todo => todo.completed);
    const todosToUpdate = todoList.filter(
      todo => todo.completed === completedAll,
    );

    if (todosToUpdate.length === 0) {
      setToogleAllTodos(toogleAllTodos);
    }

    setToogleAllTodos(todoList.map(todo => todo.id));
    setDeletingTodos(todoList.map(todo => todo.id))

    try {
      const todosFromApi = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({ ...todo, completed: !completedAll }),
        ),
      );

      setTodoList(prevTodoList =>
        prevTodoList.map(
          todo => todosFromApi.find(updated => updated.id === todo.id) || todo,
        ),
      );
    } catch (error) {
      sendErrorMessage('Unable to toggle all todos', setErrorMessage);
    } finally {
      setToogleAllTodos([]);
      setDeletingTodos([])
    }
  };

  return (
    <div className={classNames('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          filteredTodoList={filterTodos}
          submitTodo={submitTodo}
          inputRef={inputRef}
          title={title}
          handleChangeInput={handleChangeInput}
          loader={loader}
          handleToogleAll={handleToogleAll}
          todoList={todoList}
        />
         <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        filteredTodoList={filterTodos}
        deletingTodos={deletingTodos}
        handleToggleCompletion={handleToggleCompletion}
        handleDeleteTodo={handleDeleteTodo}
        setTitle={setTitle}
        setTodoList={setTodoList}
        setErrorMessage={setErrorMessage}
        setLoader={setLoader}
        setTempTodo={setTempTodo}
        setDeletingTodos={setDeletingTodos}
      />

      <TempTodo tempTodo={tempTodo} />
    </section>

        {todoList.length > 0 && (
          <Footer
            todoList={todoList}
            selectedFilter={selectedFilter}
            setSelectedFilter={(filter: Filter) => setSelectedFilter(filter)}
            handleDeleteCompletedTodo={handleDeleteCompletedTodo}
          />
        )}
      </div>

      <ErrorMessage
        message={errorMessage}
        removeMessageMessage={() => setErrorMessage('')}
      />
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/ErrorMessages';
import { Filter } from './types/Filter';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editLoader, setEditLoader] = useState<number | null>(null);
  const [prevTitle, setPrevTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const activeTodos = todos
    .filter(todo => !todo.completed)
    .map(todo => todo.id);
  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const onError = (errorString: ErrorMessages) => {
    setErrorMessage(errorString);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ALL:
      default:
        return todo;
    }
  });

  const handleUpdateStatus = async (todosId: number) => {
    try {
      setLoadingTodoIds([todosId]);
      const updatingTodoStatus = todos.find(todo => todo.id === todosId);

      if (updatingTodoStatus) {
        const canUpdateTodo = await updateTodo(todosId, {
          completed: !updatingTodoStatus.completed,
        });

        if (canUpdateTodo) {
          setTodos(
            todos.map(todo =>
              todo.id === todosId
                ? { ...todo, completed: !todo.completed }
                : todo,
            ),
          );
          setLoadingTodoIds([]);
        }
      }
    } catch (error) {
      onError(ErrorMessages.UPDATE_ERROR);
      setLoadingTodoIds([]);
    }
  };

  const handlUpdateAll = async () => {
    try {
      if (activeTodos.length > 0) {
        setLoadingTodoIds(activeTodos);

        const updateList = await Promise.allSettled(
          todos
            .filter(todo => !todo.completed)
            .map(todo => updateTodo(todo.id, { completed: !todo.completed })),
        );

        const hasErorr = updateList.some(item => item.status === 'rejected');

        const seccessIds = activeTodos
          .map((id, i) => (updateList[i].status === 'fulfilled' ? id : null))
          .filter((id): id is number => id !== null);

        setLoadingTodoIds([]);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            seccessIds.includes(todo.id) ? { ...todo, completed: true } : todo,
          ),
        );

        if (hasErorr) {
          onError(ErrorMessages.UPDATE_ERROR);
        }
      } else {
        setLoadingTodoIds(completedTodos);

        const updateList = await Promise.allSettled(
          todos
            .filter(todo => todo.completed)
            .map(todo => updateTodo(todo.id, { completed: !todo.completed })),
        );

        const hasErorr = updateList.some(item => item.status === 'rejected');

        const seccessIds = completedTodos
          .map((id, i) => (updateList[i].status === 'fulfilled' ? id : null))
          .filter((id): id is number => id !== null);

        setLoadingTodoIds([]);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            seccessIds.includes(todo.id) ? { ...todo, completed: false } : todo,
          ),
        );

        if (hasErorr) {
          onError(ErrorMessages.UPDATE_ERROR);
        }
      }
    } catch {
      onError(ErrorMessages.UPDATE_ERROR);
    }
  };

  const handlClearAll = async () => {
    try {
      setLoadingTodoIds(completedTodos);
      const deletionList = await Promise.allSettled(
        completedTodos.map(id => deleteTodo(id)),
      );

      const hasErorr = deletionList.some(item => item.status === 'rejected');
      const seccessIds = completedTodos
        .map((id, i) => (deletionList[i].status === 'fulfilled' ? id : null))
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !seccessIds.includes(todo.id)));
      setLoadingTodoIds([]);

      if (hasErorr) {
        onError(ErrorMessages.DELETE_ERROR);
      }
    } catch {
      onError(ErrorMessages.DELETE_ERROR);
    }
  };

  const handleDelete = async (todosId: number) => {
    try {
      setLoadingTodoIds([todosId]);
      const deleteAproved = await deleteTodo(todosId);

      if (deleteAproved) {
        setTodos(filteredTodos.filter(todo => todo.id !== todosId));
        setLoadingTodoIds([]);
      }
    } catch (error) {
      onError(ErrorMessages.DELETE_ERROR);
      setLoadingTodoIds([]);
    }
  };

  const handleEditTitle = (todoId: number, title: string) => {
    setEditingTodoId(todoId);
    setPrevTitle(title);
    setNewTitle(title);
  };

  const handleSaveEditTitle = async (todosId: number) => {
    try {
      const cleanTitle = newTitle.trim();

      if (cleanTitle === prevTitle) {
        setEditingTodoId(null);
        setNewTitle('');

        return;
      }

      if (!cleanTitle) {
        try {
          setEditLoader(editingTodoId);
          const deleteAproved = await deleteTodo(todosId);

          if (deleteAproved) {
            setTodos(filteredTodos.filter(todo => todo.id !== todosId));
            setEditingTodoId(null);
            setNewTitle('');
          }
        } catch (error) {
          onError(ErrorMessages.DELETE_ERROR);
        }

        return;
      }

      setEditLoader(editingTodoId);
      const updateTitle = await updateTodo(todosId, { title: cleanTitle });

      if (updateTitle) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updateTitle.id
              ? { ...todo, title: updateTitle.title }
              : todo,
          ),
        );
      }

      setEditLoader(null);
      setEditingTodoId(null);
      setNewTitle('');
    } catch (error) {
      onError(ErrorMessages.UPDATE_ERROR);
      setEditLoader(null);
    }
  };

  const handleTodoSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cleanInput = input.trim();

        if (cleanInput !== '') {
          const tempTodoObject: Todo = {
            id: 0,
            title: cleanInput,
            userId: USER_ID,
            completed: false,
          };

          setTempTodo(tempTodoObject);
          const newTodo = await postTodo(cleanInput);

          if (newTodo) {
            setTempTodo(null);
            setTodos([...todos, newTodo]);
            setInput('');
            setErrorMessage('');
            if (titleInputRef.current) {
              titleInputRef.current.focus();
            }
          }
        }

        if (!cleanInput) {
          onError(ErrorMessages.TITLE_ERROR);
          setTempTodo(null);
        }
      }
    } catch (error) {
      onError(ErrorMessages.ADDING_ERROR);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    getTodos()
      .then((res: Todo[]) => {
        setTodos(res);
      })
      .catch(() => {
        onError(ErrorMessages.LOADING_ERROR);
      });
  }, []);

  useEffect(() => {
    if ((tempTodo === null || loadingTodoIds) && titleInputRef.current) {
      titleInputRef.current?.focus();
    }

    if (editingTodoId && editInputRef.current) {
      editInputRef.current?.focus();
    }
  }, [tempTodo, loadingTodoIds, editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          titleInputRef={titleInputRef}
          tempTodo={tempTodo}
          input={input}
          activeTodos={activeTodos}
          setInput={setInput}
          handleTodoSubmit={handleTodoSubmit}
          handlUpdateAll={handlUpdateAll}
        />
        <TodoList
          filteredTodos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          editingTodoId={editingTodoId}
          editLoader={editLoader}
          newTitle={newTitle}
          editInputRef={editInputRef}
          handleDelete={handleDelete}
          handleUpdateStatus={handleUpdateStatus}
          handleEditTitle={handleEditTitle}
          handleSaveEditTitle={handleSaveEditTitle}
          setNewTitle={setNewTitle}
          setEditingTodoId={setEditingTodoId}
        />
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            handlClearAll={handlClearAll}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};

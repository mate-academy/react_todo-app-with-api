import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getTodos,
  patchTodoCompleted,
  patchTodoTitle,
  postTodo,
  removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoAppFooter } from './components/TodoAppFooter';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodosList } from './components/TodosList';
import { SortType } from './types/SortType';

import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const isErrorDefault = {
    loadError: false,
    addError: false,
    deleteError: false,
    updateError: false,
    emptyTitleError: false,
  };

  const user = useContext(AuthContext) as User;
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [copyTodos, setCopyTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(isErrorDefault);
  const [selectParametr, setSelectParametr] = useState(SortType.all);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [changedId, setChangedId] = useState<number [] | null>(null);
  const [updatedTitleId, setUpdatedTitleId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const activeTodosLength = useMemo(() => (
    copyTodos.filter(el => !el.completed).length
  ), [copyTodos, changedId]);

  const [activeToggleAll, setActiveToggleAll]
    = useState(false);

  useEffect(() => {
    setActiveToggleAll(activeTodosLength === 0);
  }, [activeTodosLength]);

  const completedTodos
    = useMemo(() => (todos.filter(todo => todo.completed)),
      [copyTodos, changedId]);

  const isSomeError = Object.entries(isError).some(el => el[1] === true);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(user.id);

      setTodos(loadedTodos);
      setCopyTodos(loadedTodos);
      setIsError(isErrorDefault);
    } catch (error) {
      setIsError({ ...isError, loadError: true });
    }
  };

  const createTodo = async () => {
    setIsAdding(true);
    try {
      if (newTodoTitle.length === 0) {
        return;
      }

      const createdTodo = await postTodo(newTodoTitle, user.id);

      setTodos([...todos, createdTodo]);
      setCopyTodos([...todos, createdTodo]);
    } catch {
      setIsError({ ...isError, addError: true });
    } finally {
      setNewTodo(null);
      setIsAdding(false);
    }
  };

  const deleteTodo = async (todoId: number[]) => {
    setChangedId(todoId);
    let index: number[] = [];
    const deleteRequests = todoId.map(el => removeTodo(el));

    try {
      await Promise.all(deleteRequests);
      index = todoId.length === 1
        ? [todos.findIndex(todo => todo.id === todoId[0])]
        : completedTodos.map(el => todos.findIndex(item => el.id === item.id));

      const newTodos = todos.filter((_todo, i) => !index.includes(i));

      setTodos(newTodos);
      setCopyTodos(newTodos);
    } catch {
      setIsError({ ...isError, deleteError: true });
    } finally {
      setChangedId(null);
    }
  };

  const updateTodoCompleted = async (upTodos: Todo[]) => {
    const updatedTodos = upTodos;

    setChangedId(updatedTodos.map(el => el.id));

    const updatedRequests
      = updatedTodos.map(el => patchTodoCompleted(el.id, el.completed));

    try {
      await Promise.all(updatedRequests);

      updatedTodos.forEach(todo => {
        if (todo) {
          const updateTodo = todo;

          updateTodo.completed = !updateTodo.completed;
        }
      });
    } catch {
      setIsError({ ...isError, updateError: true });
    } finally {
      setChangedId(null);
    }
  };

  const updateTodoTitle = async (todo: Todo) => {
    const updatedTodo = todo;

    setChangedId([updatedTodo.id]);

    try {
      await patchTodoTitle(updatedTodo.id, newTitle);

      updatedTodo.title = newTitle;
    } catch {
      setIsError({ ...isError, updateError: true });
    } finally {
      setChangedId(null);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = copyTodos
      .filter(todo => {
        switch (selectParametr) {
          case SortType.active:
            return !todo.completed;

          case SortType.completed:
            return todo.completed;

          default:
            return todo;
        }
      });

    setTodos(filteredTodos);
  }, [selectParametr, copyTodos]);

  const handlesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoTitle.length === 0) {
      setIsError({ ...isError, emptyTitleError: true });
    }

    setNewTodo({
      id: 0,
      userId: user.id,
      title: newTodoTitle,
      completed: false,
    });

    createTodo();
    setNewTodoTitle('');
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.currentTarget;
    const todoId = [+name];

    deleteTodo(todoId);
  };

  const handleDeleteCompleted = () => {
    deleteTodo(completedTodos.map(el => el.id));
  };

  const handleToggle = (event: React.MouseEvent<HTMLInputElement>) => {
    const { name } = event.currentTarget;
    const updatedTodo = todos.find(el => el.id === +name);

    if (updatedTodo) {
      updateTodoCompleted([updatedTodo]);
    }
  };

  const handleToggleAll = () => {
    const updatedTodo = activeToggleAll
      ? todos
      : todos.filter(todo => !todo.completed);

    updateTodoCompleted(updatedTodo);
  };

  const hanldleCreateTitleForm = (event: React.MouseEvent<HTMLSpanElement>) => {
    const { id, title } = event.currentTarget;
    const todoId = +id;

    setUpdatedTitleId(todoId);
    setNewTitle(title);
  };

  const handleChangeTodoTitle
  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTitle(value);
  };

  const updateTitle = () => {
    const updatedTodo = todos.find(todo => todo.id === updatedTitleId);

    if (newTitle === updatedTodo?.title) {
      setUpdatedTitleId(null);

      return;
    }

    if (newTitle.length === 0 && updatedTitleId) {
      deleteTodo([updatedTitleId]);

      setUpdatedTitleId(null);

      return;
    }

    if (updatedTodo) {
      updateTodoTitle(updatedTodo);
    }

    setUpdatedTitleId(null);
  };

  const handlesSubmitNewTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTitle();
  };

  const handleBlur = () => {
    updateTitle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      updateTitle();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          newTodoField={newTodoField}
          todosLength={todos.length}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handlesSubmit={handlesSubmit}
          isAdding={isAdding}
          activeToggleAll={activeToggleAll}
          handleToggleAll={handleToggleAll}
        />
        <TodosList
          todos={todos}
          newTodo={newTodo}
          isAdding={isAdding}
          handleDelete={handleDelete}
          deletedId={changedId}
          handleToggle={handleToggle}
          updatedTitleId={updatedTitleId}
          hanldleCreateTitleForm={hanldleCreateTitleForm}
          handleChangeTodoTitle={handleChangeTodoTitle}
          newTitle={newTitle}
          handlesSubmitNewTitle={handlesSubmitNewTitle}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
        />

        {(todos.length > 0 || selectParametr !== SortType.all) && (
          <TodoAppFooter
            selectParametr={selectParametr}
            setSelectParametr={setSelectParametr}
            activeTodosLength={activeTodosLength}
            completTodoLength={completedTodos.length}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {isSomeError && (
        <ErrorNotification
          isError={isError}
          setIsError={setIsError}
          isErrorDefault={isErrorDefault}
        />
      )}
    </div>
  );
};

import React, {
  useEffect, useState, useContext, useRef,
} from 'react';
import {
  deleteTodo, getTodos, patchTodo, sendTodo,
} from '../../../api/todos';
import { Sort } from '../../../types/enums/Sort';
import { SendedTodo } from '../../../types/SendedTodo';
import { Todo } from '../../../types/Todo';
import { AuthContext } from '../../Auth/AuthContext';

// #region types

type Props = {
  children: React.ReactNode;
};

type Context = {
  todos: Todo[],
  newTodo: SendedTodo | null,
  newTodoField: React.RefObject<HTMLInputElement> | null,
  isAdding: boolean,
  error: string,
  filterBy: Sort,
  modifiedTodosId: number[],
  hidden: boolean,
  todoWithFormId: number,
};

type UpdateContext = {
  handleNewSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  handleNewInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  changeFilterBy: (newStatus: Sort) => void,
  clearCompleted: () => void,
  removeTodo: (todoId: number) => void,
  handleChangeComplet: (todo: Todo) => void,
  handleChangeTitle: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => void,
  handleTitleUpdate: (
    event: React.FormEvent<HTMLFormElement> | null,
    todo: Todo,
  ) => void,
  setTodoInputStatus: (id: number, todo: Todo | null) => void,
  closeErrorMessage: () => void,
  changeAllComplet: (isCompleted: boolean) => void,
  unsaveTitle: () => void,
};

// #endregion

export const TodoContext = React.createContext<Context>({
  todos: [],
  newTodo: null,
  newTodoField: null,
  isAdding: false,
  error: '',
  filterBy: Sort.ALL,
  modifiedTodosId: [0],
  hidden: true,
  todoWithFormId: 0,
});

export const TodoUpdateContext = React.createContext<UpdateContext>({
  handleNewSubmit: () => {},
  handleNewInput: () => {},
  changeFilterBy: () => {},
  clearCompleted: () => {},
  removeTodo: () => {},
  handleChangeComplet: () => {},
  handleChangeTitle: () => {},
  handleTitleUpdate: () => {},
  setTodoInputStatus: () => {},
  closeErrorMessage: () => {},
  changeAllComplet: () => {},
  unsaveTitle: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<SendedTodo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [modifiedTodosId, setModifiedTodosId] = useState<number[]>([0]);
  const [filterBy, setFilterBy] = useState(Sort.ALL);
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoWithFormId, setTodoWithFormId] = useState(0);

  // handling status of adding todo to disable main input
  function handleAdding(isAddingStatus: boolean) {
    setIsAdding(isAddingStatus);
  }

  // #region ---- DATA API ----
  // download todos from server
  async function loadTodos() {
    if (user) {
      try {
        const todosFromApi = await getTodos(user?.id);

        setTodos(todosFromApi);
      } catch {
        setHidden(false);
        setError('Unable to download todos');
        throw new Error('Unable to download todos');
      }
    }
  }

  // adding todo when getting title from user
  async function sendNewTodo(data: SendedTodo) {
    handleAdding(true);

    if (tempTodo) {
      setTodos(current => (
        [...current, { ...tempTodo, title: tempTodo.title.trim() }]
      ));
    }

    if (user && data) {
      try {
        const todoFromServer = await sendTodo(user?.id, data);

        setTodos(current => current.map(todo => {
          if (todo.id === 0) {
            return { ...todo, id: todoFromServer.id };
          }

          return todo;
        }));
      } catch {
        setHidden(false);
        setTodos(current => current.slice(0, current.length - 1));
        setError('Unable to add a todo');
        throw new Error('Unable to add a todo');
      }
    }

    setNewTodo(null);
    handleAdding(false);
  }

  // delete todos or todo
  async function deleteTodos(todosId: number[]) {
    if (user && todosId) {
      try {
        await Promise.all(todosId.map(todoId => deleteTodo(todoId)));

        setTodos(currentTodos => (
          currentTodos.filter(({ id }) => !todosId.includes(id))
        ));
        setModifiedTodosId([0]);
      } catch {
        setModifiedTodosId([0]);
        setHidden(false);
        setError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      }
    }
  }

  // modify todos through modifying complete status or title
  async function modifyTodos(changedTodos: Todo[]) {
    if (user) {
      try {
        const todosFromServer = await Promise
          .all(changedTodos.map(todo => patchTodo(todo)));

        setTodos(currentTodos => currentTodos.map(todo => {
          const modifiedTodo: Todo | null = todosFromServer
            .find(todoFromServer => todoFromServer.id === todo.id) || null;

          if (modifiedTodo) {
            return {
              ...todo,
              title: modifiedTodo.title || '',
              completed: modifiedTodo.completed || false,
            };
          }

          return todo;
        }));
        setModifiedTodosId([0]);
      } catch {
        setModifiedTodosId([0]);
        setHidden(false);
        setError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      }
    }
  }

  // #endregion

  // #region ---- HEADER ----
  // handle submit action of main input (from where title comes)
  function handleNewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newTodo?.title.trim()) {
      sendNewTodo(newTodo);
    } else {
      setHidden(false);
      setNewTodo(null);
      setError('Title can\'t be empty or consist only spaces');
    }

    newTodoField.current?.blur();
  }

  // handle input action of main input (where user type new title for new todo)
  function handleNewInput(event: React.ChangeEvent<HTMLInputElement>) {
    const userTodo = {
      userId: user?.id,
      title: event.target.value,
      completed: false,
    };

    const temporaryTodo = {
      id: 0,
      userId: user?.id,
      title: event.target.value,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setNewTodo(userTodo);
  }

  function changeAllComplet(isCompleted: boolean) {
    const isNotCompleted = todos.every(({ completed }) => !completed);

    if (isCompleted || isNotCompleted) {
      const allIds = todos.map(todo => todo.id);
      const modifiedTodos = todos.map(todo => {
        return ({
          ...todo,
          completed: !todo.completed,
        });
      });

      setModifiedTodosId(allIds);
      modifyTodos(modifiedTodos);
    } else {
      const nonActiveTodos = todos
        .filter(({ completed }) => !completed);
      const nonActiveIds = nonActiveTodos
        .map(todo => todo.id);
      const modifiedTodos = nonActiveTodos
        .map(todo => {
          return ({
            ...todo,
            completed: !todo.completed,
          });
        });

      setModifiedTodosId(nonActiveIds);
      modifyTodos(modifiedTodos);
    }
  }

  // #endregion

  // #region ---- TODOS ----
  // change existing todo complet propery
  function handleChangeComplet(todo: Todo) {
    const modifiedTodos = {
      ...todo,
      completed: !todo.completed,
    };

    setModifiedTodosId([todo.id]);
    modifyTodos([modifiedTodos]);
  }

  // change existing todo title not updating the API
  function handleChangeTitle(
    event: React.ChangeEvent<HTMLInputElement>, todoId: number,
  ) {
    setTodos(currentTodos => currentTodos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return {
        ...todo,
        title: event.target.value,
      };
    }));
  }

  // return title from temp state if it hadn't been modified
  function unsaveTitle() {
    setTodos(currentTodos => currentTodos.map(todo => {
      if (todo.id !== tempTodo?.id) {
        return todo;
      }

      return {
        ...todo,
        title: tempTodo?.title,
      };
    }));
  }

  // remove one existing todo
  function removeTodo(todoId: number) {
    setModifiedTodosId([todoId]);
    deleteTodos([todoId]);
  }

  // activate input to change existing todo title
  function setTodoInputStatus(
    id: number,
    todo: Todo | null,
  ) {
    setTempTodo(() => (todo ? { ...todo } : null));
    setTodoWithFormId(id);
  }

  // handle existing todo title change
  function handleTitleUpdate(
    event: React.FormEvent<HTMLFormElement> | null,
    todo: Todo,
  ) {
    setModifiedTodosId([todo.id]);
    event?.preventDefault();

    if (todo.title === tempTodo?.title) {
      setModifiedTodosId([0]);
      setTodoInputStatus(0, null);

      return;
    }

    if (todo.title.length === 0) {
      deleteTodos([todo.id]);
    } else {
      modifyTodos([{ ...todo, title: todo.title.trim() }]);
    }
  }

  // #endregion

  // #region ---- FOOTER ----

  // change sort type
  function changeFilterBy(newStatus: Sort) {
    setFilterBy(newStatus);
  }

  // delete completed todos
  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedId = completedTodos.map(todo => todo.id);

    setModifiedTodosId(completedId);
    deleteTodos(completedId);
  }

  // #endregion

  // #region ---- UseEffects ----

  const closeErrorMessage = () => {
    setHidden(true);
  };

  // load data
  useEffect(() => {
    loadTodos();
  }, []);

  // when data trigger error, the message will be auto removed in 3 sec
  useEffect(() => {
    setTimeout(() => {
      setError('');
      closeErrorMessage();
    }, 3000);
  }, [error]);

  // #endregion

  const contextValue = {
    todos,
    newTodo,
    newTodoField,
    isAdding,
    error,
    filterBy,
    modifiedTodosId,
    hidden,
    todoWithFormId,
  };

  const updateContextValue = {
    handleNewSubmit,
    handleNewInput,
    changeFilterBy,
    clearCompleted,
    removeTodo,
    handleChangeComplet,
    handleChangeTitle,
    setTodoInputStatus,
    handleTitleUpdate,
    closeErrorMessage,
    changeAllComplet,
    unsaveTitle,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      <TodoUpdateContext.Provider value={updateContextValue}>
        {children}
      </TodoUpdateContext.Provider>
    </TodoContext.Provider>
  );
};

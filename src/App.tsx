import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  updateTodo,
  deleteTodo,
  getTodos,
  postTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todoList, setTodolist] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filters>(Filters.All);
  const [showError, setShowError] = useState<Errors>(Errors.None);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [targetTodoId, setTargetTodoId] = useState<number>(0);
  const [completedDelete, setCompletedDelete] = useState<boolean>(false);
  const [changeTodo, setChangeTodo] = useState<Todo | null>(null);
  const [changeCompleted, setChangeCompleted] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const countActivaTodos = todosFromServer.filter(
    todo => !todo.completed,
  ).length;

  const completedTodo = todoList.filter(todo => todo.completed);
  const notCompletedTodo = todoList.filter(todo => !todo.completed);

  const resetAll = () => {
    setIsAdding(false);
    setInputValue('');
    setTargetTodoId(0);
    setCompletedDelete(false);
    setChangeTodo(null);
    setChangeCompleted(false);
    setIsUpdating(false);
  };

  async function loadingTodos() {
    if (!user) {
      return;
    }

    const todos = await getTodos(user.id);

    setTodosFromServer(todos);
    setTodolist(todos);
    resetAll();
  }

  async function addNewTodo() {
    if (!user) {
      setShowError(Errors.Add);

      return;
    }

    if (!inputValue) {
      setShowError(Errors.Empty);

      return;
    }

    setIsAdding(true);

    const newTodo: Todo = {
      id: 0,
      userId: user.id,
      title: inputValue,
      completed: false,
    };

    try {
      await postTodo(newTodo);
      loadingTodos();
    } catch (error) {
      setShowError(Errors.Add);
      resetAll();
    }
  }

  async function removeTodo() {
    if (!targetTodoId) {
      return;
    }

    try {
      await deleteTodo(targetTodoId);
      loadingTodos();
    } catch {
      setShowError(Errors.Delete);
      resetAll();
    }
  }

  async function removeCompleted() {
    setCompletedDelete(true);

    try {
      await Promise.allSettled(
        completedTodo.map(todo => deleteTodo(todo.id)),
      );

      loadingTodos();
    } catch {
      setShowError(Errors.Delete);
      resetAll();
    }
  }

  const changeCompleteStatus = async (targetTodo: Todo) => {
    const {
      id,
      userId,
      title,
      completed,
    } = targetTodo;

    setTargetTodoId(id);

    const newTodo: Todo = {
      id,
      userId,
      title,
      completed: !completed,
    };

    try {
      await updateTodo(id, newTodo);
      loadingTodos();
    } catch {
      setShowError(Errors.Update);
      resetAll();
    }
  };

  async function changeAllNotCompleted() {
    let list = notCompletedTodo;

    setChangeCompleted(true);

    if (!list.length) {
      list = completedTodo;
    }

    try {
      await Promise.allSettled(
        list.map(
          todo => updateTodo(todo.id, { ...todo, completed: !todo.completed }),
        ),
      );

      loadingTodos();
    } catch {
      setShowError(Errors.Update);
      resetAll();
    }
  }

  const changeValueSubmit = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, todo);
      loadingTodos();
    } catch {
      setShowError(Errors.Update);
      resetAll();
    }
  };

  useEffect(() => {
    if (!changeTodo) {
      return;
    }

    changeCompleteStatus(changeTodo);
  }, [changeTodo]);

  useEffect(() => {
    removeTodo();
  }, [completedDelete]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadingTodos();
  }, []);

  useEffect(() => {
    switch (filterBy) {
      case Filters.Completed:
      case Filters.Active:
        setTodolist([...todosFromServer].filter(
          todo => {
            return filterBy === 'completed'
              ? todo.completed
              : !todo.completed;
          },
        ));

        break;

      default:
        setTodolist(todosFromServer);
    }
  }, [filterBy]);

  useEffect(() => {
    setTimeout(() => {
      setShowError(Errors.None);
    }, 3000);
  }, [showError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          addNewTodo={() => addNewTodo()}
          isAdding={isAdding}
          inputValue={inputValue}
          setInputValue={setInputValue}
          addButton={todoList.length > 0}
          completed={notCompletedTodo.length > 0}
          changeAllNotCompleted={() => changeAllNotCompleted()}
        />

        {todosFromServer && (
          <>
            <TodoList
              todoList={todoList}
              inputValue={inputValue}
              isAdding={isAdding}
              targetTodoId={targetTodoId}
              setTargetTodoId={setTargetTodoId}
              completedDelete={completedDelete}
              setChangeTodo={setChangeTodo}
              changeCompleted={changeCompleted}
              setCompletedDelete={setCompletedDelete}
              changeValueSubmit={changeValueSubmit}
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${countActivaTodos} items left`}
              </span>

              <Filter
                filterBy={filterBy}
                setFilterBy={setFilterBy}
              />

              {
                completedTodo.length > 0
                  ? (
                    <button
                      data-cy="ClearCompletedButton"
                      type="button"
                      className="todoapp__clear-completed"
                      onClick={removeCompleted}
                    >
                      Clear completed
                    </button>
                  ) : (
                    <div
                      className="todoapp__clear-completed"
                      style={
                        { opacity: 0, cursor: 'default' }
                      }
                    >
                      Clear completed
                    </div>
                  )
              }
            </footer>
          </>
        )}
      </div>

      {showError !== Errors.None && (
        <ErrorNotification
          text={showError}
          setShowError={setShowError}
        />
      )}
    </div>
  );
};

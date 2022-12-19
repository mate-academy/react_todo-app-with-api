import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  deleteTodo,
  getTodos,
  postTodo,
  modifyTodo,
} from '../../api/todos';

import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';
import { TodoModifier } from '../../types/TodoModifier';
import { ErrorType } from '../../types/ErrorType';
import { FilterType } from '../../types/FilterType';

import { Notification } from '../Notification';
import { TodoAddForm } from '../TodoAddForm';
import { TodoList } from '../TodoList';
import { BottomBar } from '../BottomBar';
import { TodosStatusToggler } from '../TodosStatusToggler';

export const Todos: React.FC = React.memo(() => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [modifyingTodosId, setModifyingTodosId] = useState<number[]>([11111]);

  const user = useContext(AuthContext);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        setTodos(await getTodos(user.id));
      } catch {
        setErrorMessage(ErrorType.Load);
      }
    }
  }, []);

  useEffect(() => {
    loadTodos().then();
  }, [user]);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case FilterType.All:
          return true;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [filter, todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const onTodoAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && newTodoTitle.trim()) {
      const newTodo: Omit<Todo, 'id'> = {
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      try {
        setIsAdding(true);
        const newFullTodo = await postTodo(newTodo);

        setTodos(current => [...current, newFullTodo]);
      } catch {
        setErrorMessage(ErrorType.Add);
      } finally {
        setNewTodoTitle('');
        setIsAdding(false);
      }
    } else {
      setErrorMessage(ErrorType.EmptyTitle);
    }
  };

  const onTodoDelete = async (todosId: number[]) => {
    try {
      setModifyingTodosId(current => [...current, ...todosId]);

      const promisesToDelete = async (todoId: number) => {
        await deleteTodo(todoId);
        await setTodos(current => current.filter(todo => todo.id !== todoId));
        await setModifyingTodosId(
          current => current.filter(todo => todo !== todoId),
        );
      };

      await Promise.all(todosId.map(todoId => (
        promisesToDelete(todoId)
      )));
    } catch {
      setErrorMessage(ErrorType.Delete);
    }
  };

  const onTodoModify = async (modifiedTodos: TodoModifier[]) => {
    try {
      const modifiedTodosIds = modifiedTodos.map(todo => todo.id);

      setModifyingTodosId(current => [...current, ...modifiedTodosIds]);

      const promisesToModify = async (modifier: Promise<Todo>) => {
        const modifiedTodo = await modifier;

        setTodos(current => current.map(curTodo => {
          if (curTodo.id !== modifiedTodo.id) {
            return curTodo;
          }

          return modifiedTodo;
        }));

        await setModifyingTodosId(
          current => current.filter(curTodo => curTodo !== modifiedTodo.id),
        );
      };

      await Promise.all(modifiedTodos.map(todo => {
        if ('completed' in todo) {
          promisesToModify(modifyTodo(todo.id, { completed: todo.completed }));
        }

        if ('title' in todo) {
          promisesToModify(modifyTodo(todo.id, { title: todo.title }));
        }

        return [];
      }));
    } catch {
      setErrorMessage(ErrorType.Update);
    }
  };

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!todos.length || (
            <TodosStatusToggler
              todos={todos}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              onTodoModify={onTodoModify}
            />
          )}
          <TodoAddForm
            newTodoTitle={newTodoTitle}
            onTodoTitleChange={setNewTodoTitle}
            onTodoAdd={onTodoAdd}
            isAdding={isAdding}
          />
        </header>

        {(todos.length || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              modifyingTodosId={modifyingTodosId}
              newTodoTitle={newTodoTitle}
              onTodoDelete={onTodoDelete}
              onTodoModify={onTodoModify}
            />
            <BottomBar
              filter={filter}
              onSetFilter={setFilter}
              activeTodosCount={activeTodos.length}
              completedTodos={completedTodos}
              onTodoDelete={onTodoDelete}
            />
          </>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onHideErrMessage={setErrorMessage}
      />
    </>
  );
});

/* eslint-disable prettier/prettier */
import { Todo } from '../../types/Todo';
import React, { useEffect, useState, useRef } from 'react';
import { TodosList } from '../../components/TodoList/TodoList';
import { getTodos } from '../../api/todos';
import { createTodo } from '../../api/todos';

import { deleteTodo } from '../../api/todos';
import { updateTodo } from '../../api/todos';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { Loader } from '../Loader/Loader';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem/TodoItem';
import { USER_ID } from '../../api/todos';

enum ErrorNotification {
  LoadTodos = 'Unable to load todos',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
  TitleEmpty = 'Title should not be empty',
}

export const UserTodos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const activeTodo = todos.filter(t => !t.completed).length;

  const inputTodoTitleFieldRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [todosToUpdate, setTodosToUpdate] = useState<Todo[]>([]);
  const isCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  function visibleTodos() {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      case FilterType.All:
      default:
        return todos;
    }
  }

  function loadTodos() {
    setLoading(true);
    setErrorMessage('');
    setIsErrorVisible(false);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorNotification.LoadTodos);
        setIsErrorVisible(true);
        setTimeout(() => setIsErrorVisible(false), 3000);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    if (inputTodoTitleFieldRef) {
      inputTodoTitleFieldRef.current?.focus();
    }
  });

  useEffect(() => {
    if (todosToUpdate.length === 1) {
      inputTodoTitleFieldRef.current?.focus();
    }
  }, [todosToUpdate]);

  function addTodo(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage('');

    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage(ErrorNotification.TitleEmpty);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 3000);

      return;
    }

    if (isInputDisabled === true) {
      return;
    }

    setIsInputDisabled(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo({ title: trimmed, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.AddTodo);
        setIsErrorVisible(true);
        setTimeout(() => setIsErrorVisible(false), 3000);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  }

  async function deleteUserTodo(todoId: number) {
    if (processingIds.includes(todoId)) {
      return Promise.resolve();
    }

    setProcessingIds(p => [...p, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.DeleteTodo);
        setIsErrorVisible(true);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id_1 => id_1 !== todoId));
      });
  }

  async function onClearCompleted() {
    const completed = todos.filter(t => t.completed);
    const ids = completed.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...ids]);

    const promises = ids.map(id => deleteTodo(id));
    const results = await Promise.allSettled(promises);
    const succeededIds = results
      .map((result, i) => (result.status === 'fulfilled' ? ids[i] : null))
      .filter(Boolean);

    setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));

    const rejectedIds = results
      .map((result, i) => (result.status === 'rejected' ? ids[i] : null))
      .filter(Boolean);

    if (rejectedIds.length > 0) {
      setErrorMessage(ErrorNotification.DeleteTodo);
      setIsErrorVisible(true);
    }

    setSelectedTodo(null);
  }

  async function updateUserTodo(todoToUpdate: Todo) {
    try {
      setProcessingIds(prev => [...prev, todoToUpdate.id]);
      const updated = await updateTodo(todoToUpdate);

      setTodos(current =>
        current.map(todo => (todo.id === updated.id ? updated : todo)),
      );

      return updated;
    } catch (error) {
      setErrorMessage(ErrorNotification.UpdateTodo);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 3000);

      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  }

  async function handleToggleAll() {
    const allCompleted = todos.length > 0 && isCompleted;
    const newStatus = !allCompleted;

    const todosToEdit = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToEdit.map(todo => todo.id);

    if (idsToUpdate.length === 0) {
      return;
    }

    setProcessingIds(prev => [...prev, ...idsToUpdate]);

    const promises = todosToEdit.map(todo =>
      updateUserTodo({ ...todo, completed: newStatus }),
    );

    const results = await Promise.allSettled(promises);

    const succeededIds = results
      .map((result, i) =>
        result.status === 'fulfilled' ? idsToUpdate[i] : null,
      )
      .filter(Boolean);

    setTodos(prev =>
      prev.map(todo =>
        succeededIds.includes(todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );

    const rejectedIds = results
      .map((result, i) =>
        result.status === 'rejected' ? idsToUpdate[i] : null,
      )
      .filter(Boolean);

    if (rejectedIds.length > 0) {
      setErrorMessage(ErrorNotification.UpdateTodo);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 3000);
    }

    setSelectedTodo(null);
    setProcessingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
  }

  function onChangeEditTitle(id: number, newTitle: string) {
    setTodosToUpdate(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo)),
    );
  }

  function onSaveEditTitle(id: number, newTitle: string): void | Promise<Todo> {
    const todoToUpdate = todosToUpdate.find(todo => todo.id === id);
    const trimmed = newTitle.trim();

    if (!todoToUpdate) {
      return;
    }

    if (trimmed === '') {
      return deleteUserTodo(id);
    }

    if (trimmed === todoToUpdate.title) {
      setTodosToUpdate(prev => prev.filter(todo => todo.id !== id));
    }

    return updateUserTodo({ ...todoToUpdate, title: trimmed })
      .then(updated => {
        setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
        setTodosToUpdate(prev => prev.filter(todo => todo.id !== id));

        return updated;
      })
      .catch(() => {
        setErrorMessage(ErrorNotification.UpdateTodo);
        setIsErrorVisible(true);
        setTimeout(() => setIsErrorVisible(false), 3000);

        setTodosToUpdate(prev => [...prev, todoToUpdate]);
      });
  }

  function onBeginEditTitle(todo: Todo) {
    if (todosToUpdate.find(t => t.id === todo.id)) {
      return;
    }

    setTodosToUpdate(prev => [...prev, { ...todo }]);
  }

  function onCancelEditTitle() {
    setTodosToUpdate([]);
  }

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={
                isCompleted
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              onClick={handleToggleAll}
            ></button>
          )}

          <form onSubmit={addTodo}>
            <input
              ref={inputTodoTitleFieldRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isInputDisabled}
              name="title"
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {loading && <Loader />}
        <TodosList
          todos={visibleTodos()}
          selectedTodoId={selectedTodo?.id}
          processingIds={processingIds}
          onDelete={deleteUserTodo}
          onUpdateUserTodo={updateUserTodo}
          inputTodoTitleFieldRef={inputTodoTitleFieldRef}
          editingTodos={todosToUpdate}
          onBeginEditTitle={onBeginEditTitle}
          onChangeEditTitle={onChangeEditTitle}
          onSaveEditTitle={onSaveEditTitle}
          onCancelEditTitle={onCancelEditTitle}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            selectedTodoId={selectedTodo?.id}
            isProcessed={true}
            onDelete={() => deleteUserTodo?.(tempTodo.id)}
            onUpdateUserTodo={updateUserTodo}
            inputTodoTitleFieldRef={inputTodoTitleFieldRef}
            editingTodoId={todosToUpdate.find(t => t.id === tempTodo.id)?.id}
            editTitle={
              todosToUpdate.find(t => t.id === tempTodo.id)?.title ?? ''
            }
            onBeginEditTitle={onBeginEditTitle}
            onChangeEditTitle={onChangeEditTitle}
            onSaveEditTitle={onSaveEditTitle}
            onCancelEditTitle={onCancelEditTitle}
          />
        )}
        {todos.length > 0 && (
          <TodoFooter
            todosCountActive={activeTodo}
            filter={filter}
            onChangeFilter={setFilter}
            canClearCompleted={todos.some(t => t.completed)}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <div
        className={
          isErrorVisible
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'notification is-danger is-light has-text-weight-normal hidden'
        }
        data-cy="ErrorNotification"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsErrorVisible(false)}
        />
        {errorMessage}
        <br />
      </div>
    </>
  );
};

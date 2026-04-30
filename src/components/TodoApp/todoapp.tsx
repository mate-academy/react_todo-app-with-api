import '../../styles/todoapp.scss';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as postService from '../../api/todos';
import { USER_ID } from '../../api/todos';
import { Filter as Filters, Todo as Todos } from '../../types/Todo';
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../Todo/todo';
import { Filter } from '../Filter/filter';

type Props = {
  posts: Todos[];
  setPosts: Dispatch<SetStateAction<Todos[]>>;
  loading: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todos | null>>;
  tempTodo: Todos | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoApp: React.FC<Props> = ({
  posts,
  setPosts,
  loading,
  setErrorMessage,
  setTempTodo,
  setLoading,
  tempTodo,
}) => {
  const hasTodos = posts.length > 0;
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [title, setTitle] = useState('');
  // const isTitleEmpty = title.trim() === '';
  const allCompleted = posts.length > 0 && posts.every(post => post.completed);
  const hasPosts = posts.length > 0;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const setIsUpdatingFor = (id: number, value: boolean) =>
    setUpdatingIds(prev => {
      if (value) {
        return prev.includes(id) ? prev : [...prev, id];
      }

      return prev.filter(x => x !== id);
    });

  const prevTodosCount = useRef(posts.length);

  useEffect(() => {
    if (posts.length < prevTodosCount.current && inputRef.current) {
      inputRef.current.focus();
    }

    prevTodosCount.current = posts.length;
  }, [posts]);

  const [isAdding, setIsAdding] = useState(false);

  async function handleAddPost(event: React.FormEvent) {
    event.preventDefault();
    const value = title.trim();

    if (!value) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsAdding(true);
    setTempTodo({
      id: 0,
      title: value,
      completed: false,
      userId: USER_ID,
    });
    try {
      const newTodo = await postService.createTodo(value, USER_ID);

      setPosts(current => [...current, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  }

  const handleToggleAll = async () => {
    setErrorMessage('');
    const shouldCompleteAll = !posts.every(todo => todo.completed);
    const idsToUpdate = posts
      .filter(t => t.completed !== shouldCompleteAll)
      .map(t => t.id);

    if (idsToUpdate.length === 0) {
      return;
    }

    setIsTogglingAll(true);
    try {
      const updatedTodos = await Promise.all(
        idsToUpdate.map(i =>
          postService.updateTodo(i, { completed: shouldCompleteAll }),
        ),
      );

      setPosts(prev =>
        prev.map(todo => updatedTodos.find(u => u.id === todo.id) || todo),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsTogglingAll(false);
    }
  };

  useEffect(() => {
    if (!loading && !isAdding) {
      inputRef.current?.focus();
    }
  }, [loading, isAdding]);

  return (
    <>
      <header className="todoapp__header">
        {hasPosts && (
          <button
            type="button"
            disabled={loading}
            onClick={handleToggleAll}
            className={`todoapp__toggle-all${allCompleted ? ' active' : ''}`}
            data-cy="ToggleAllButton"
          />
        )}

        <form onSubmit={handleAddPost}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={inputRef}
            value={title || ''}
            onChange={event => setTitle(event.target.value)}
            disabled={isAdding || loading}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>
      <main className="todoapp__main">
        {hasTodos && (
          <>
            <Todo
              posts={posts}
              setErrorMessage={setErrorMessage}
              setPosts={setPosts}
              filter={filter}
              tempTodo={tempTodo}
              setLoading={setLoading}
              loading={loading}
              setIsUpdatingFor={setIsUpdatingFor}
              updatingIds={updatingIds}
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
            />
            <Filter
              setErrorMessage={setErrorMessage}
              posts={posts}
              filter={filter}
              setPosts={setPosts}
              setFilter={setFilter}
              setLoading={setLoading}
              loading={loading}
            />
          </>
        )}
        {isTogglingAll && (
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay is-active')}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </main>
    </>
  );
};

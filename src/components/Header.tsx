import cn from 'classnames';
import React, { ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { updateTodos, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from './errorsMessage';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  posts: Todo[];
  disableInput?: boolean;
  setIsInputLoading: number;
  setTodoTemplate: React.Dispatch<React.SetStateAction<Todo | null>>;
  valueTitle: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  addPost: (event: FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  posts,
  setIsInputLoading,
  addPost,
  valueTitle,
  setValue,
  disableInput,
}) => {
  const fieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldFocus.current) {
      fieldFocus.current.focus();
    }
  }, [setIsInputLoading, posts]);
  const areAllCompleted = posts.every((todo: Todo) => todo.completed);

  const setCompleted = () => {
    let flag = true;

    if (areAllCompleted) {
      flag = false;
    }

    posts.map(post => {
      const id = post.id;

      if (post.completed != flag) {
        updateTodos({
          id: id,
          userId: USER_ID,
          title: post.title,
          completed: flag,
        })
          .then(respone => {
            setTodos(prevTodos =>
              prevTodos.map((item: Todo) =>
                item.id === respone.id ? respone : item,
              ),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.updateError);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.noError);
            }, 3000);
          });
      }
    });
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <header className="todoapp__header">
      {posts.length !== 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={cn('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          onClick={setCompleted}
        />
      )}
      <form onSubmit={event => addPost(event)}>
        <input
          ref={fieldFocus}
          data-cy="NewTodoField"
          type="text"
          onChange={onTextChange}
          value={valueTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disableInput}
        />
      </form>
    </header>
  );
};

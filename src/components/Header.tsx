import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import * as postService from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMesage } from '../types/ErrorIMessage';

type Props = {
  USER_ID: number,
  todo: Todo,
  setTodo: Dispatch<SetStateAction<Todo>>
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  setErrorMessage: Dispatch<SetStateAction<ErrorMesage>>
};

export const Header: React.FC<Props> = ({
  USER_ID,
  todo,
  setTodo,
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [text, setText] = useState('');
  const [toggleClickCount, setToggleClickCount] = useState<number>(0);

  async function updateData() {
    setToggleClickCount((current) => current + 1);
    try {
      await Promise.all(todos.map((t) => {
        return postService.updateTodo(t.id, {
          completed: toggleClickCount % 2 === 0,
        });
      }));
    } catch (error) {
      setErrorMessage(ErrorMesage.deletingError);
    }

    setTodos((currentTodos) => (
      currentTodos.map((currentTodo) => (
        { ...currentTodo, completed: toggleClickCount % 2 === 0 }
      ))
    ));
  }

  const setEmptyTitleErrorWithTimeOut = () => {
    setErrorMessage(ErrorMesage.emptyTitleError);
    setTimeout(() => {
      setErrorMessage(ErrorMesage.noErrors);
    }, 2000);
  };

  useEffect(() => {
    const setPostErrorWithTimeOut = () => {
      setErrorMessage(ErrorMesage.addingError);
      setTimeout(() => {
        setErrorMessage(ErrorMesage.noErrors);
      }, 2000);
    };

    async function postData() {
      try {
        await postService.createTodo(todo);
      } catch (error) {
        setPostErrorWithTimeOut();
      }
    }

    postData();
  }, [todo, setErrorMessage]);

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setEmptyTitleErrorWithTimeOut();

      return;
    }

    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      USER_ID,
      title: text,
      completed: false,
    };

    setTodo(newTodo);
    setTodos([...todos, newTodo]);
    setText('');
  };

  return (

    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggle between 3 buttons"
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={updateData}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={handleInputTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

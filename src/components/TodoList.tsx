import {
  Dispatch,
  FC, LegacyRef, SetStateAction, useEffect, useState,
} from 'react';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { TodoItem } from './TodoItem';

interface Props {
  user: User,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
  todoTitle: string,
}

export const TodoList: FC<Props> = (props) => {
  const {
    user,
    todos,
    setTodos,
    setErrorMessages,
    newTodoField,
    todoTitle,
  } = props;

  const [isLoadingTodoList, setIsLoadingTodoList] = useState(false);

  useEffect(() => {
    setIsLoadingTodoList(true);
    setErrorMessages([]);

    getTodos(user.id)
      .then(setTodos)
      .catch((error) => {
        setErrorMessages((prev: string []) => [...prev, error.message]);
      })
      .finally(() => setIsLoadingTodoList(false));
  }, [setErrorMessages, setTodos, user]);

  return (
    <>
      {!isLoadingTodoList && (
        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              todos={todos}
              newTodoField={newTodoField}
              setTodos={setTodos}
              todoTitle={todoTitle}
            />
          ))}
        </section>
      )}
    </>
  );
};

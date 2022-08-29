import {
  Dispatch,
  FC, SetStateAction, useEffect, useState,
} from 'react';
import { getTodos } from '../api/todos';
import { TodoOptimistic } from '../types/Todo';
import { User } from '../types/User';
import { TodoItem } from './TodoItem';

interface Props {
  user: User,
  todos: TodoOptimistic[],
  setTodos: Dispatch<SetStateAction<TodoOptimistic[]>>,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  todoTitle: string,
}

export const TodoList: FC<Props> = (props) => {
  const {
    user,
    todos,
    setTodos,
    setErrorMessages,
    todoTitle,
  } = props;

  const [isLoadingTodoList, setIsLoadingTodoList] = useState(false);

  useEffect(() => {
    setIsLoadingTodoList(true);
    setErrorMessages([]);

    getTodos(user.id)
      .then(setTodos)
      .catch(() => {
        setErrorMessages(
          (prev: string []) => [...prev, 'No todos'],
        );
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
              setTodos={setTodos}
              todoTitle={todoTitle}
              setErrorMessages={setErrorMessages}
            />
          ))}
        </section>
      )}
    </>
  );
};

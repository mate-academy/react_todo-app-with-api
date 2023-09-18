import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../Todo/TodoTask';
import { useLoadingTodos } from '../Contexts/LoadingTodosContext';
import { deleteTodo } from '../../api/todos';
import { useTodos } from '../Contexts/TodosContext';
import { useErrorMessage } from '../Contexts/ErrorMessageContext';

type Props = {
  todos: Todo[]
};

export const TodoList: React.FC<Props> = ({
  todos,
}) => {
  const { setTodos } = useTodos();
  const { setLoadingTodos } = useLoadingTodos();
  const { setErrorMessage, setIsErrorHidden } = useErrorMessage();

  const onDelete = (todoId: number) => {
    setLoadingTodos(prev => [...prev, { todoId, isLoading: true }]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== todoId));
      })
      .catch((error) => {
        setErrorMessage(JSON.parse(error.message).error);
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(todo => todo.todoId !== todoId));
      });
  };

  return (
    <>
      {todos?.map(todo => (
        <TodoTask
          onDelete={onDelete}
          todo={todo}
          key={todo.id}
        />
      ))}
    </>
  );
};

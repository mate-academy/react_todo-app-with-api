import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// Hooks
import { useAppDispatch } from 'hooks/useAppDispatch';
// Models
import ITodo from 'models/Todo';
import IUser from 'models/User';
// Async
import { fetchTodos } from 'store/todos/todosAsync';
// Selectors
import { selectFilteredTodos } from 'store/todos/todosSelectors';
import { selectCurrentUser } from 'store/users/usersSelectors';
// Components
import TodoItem from './TodoItem';
// MUI
import { Box, LinearProgress } from '@mui/material';

const TodosList:React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const currentUser: IUser | null = useSelector(selectCurrentUser);
  const todos: ITodo[] | null = useSelector(selectFilteredTodos);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);

      dispatch(fetchTodos(currentUser?.id))
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!todos) {
    return null;
  }

  return (
    <Box>
      {todos.map((todo: ITodo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </Box>
  );
};

export default TodosList;

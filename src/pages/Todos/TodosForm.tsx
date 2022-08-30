import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
// Hooks
import { useAppDispatch } from 'hooks/useAppDispatch';
// Async
import { createTodo, updateTodo } from 'store/todos/todosAsync';
// Actions
import { appActions } from 'store/app/appSlice';
// Selectos
import { selectCurrentUser } from 'store/users/usersSelectors';
import { selectActiveTodos, selectCompletedTodos, selectTodos } from 'store/todos/todosSelectors';
// Models
import IUser from 'models/User';
import ITodo from 'models/Todo';
// Types
import NotificationStatuses from 'types/NotificationStatuses';
// MUI
import { CircularProgress, IconButton, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IForm {
  title: string;
}

const TodosForm:React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const todos: ITodo[] | null = useSelector(selectTodos);
  const activeTodos: ITodo[] | null = useSelector(selectActiveTodos);
  const completedTodos: ITodo[] | null = useSelector(selectCompletedTodos);
  const currentUser: IUser | null = useSelector(selectCurrentUser);

  const selectAll = () => {
    if (!todos || !todos.length) return;

    if (!!activeTodos?.length) {
      activeTodos.map(todo => {
        dispatch(updateTodo({ todoId: todo.id, todo: { completed: !todo.completed } }))
          .unwrap()
          .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todos was updated' })))
      })
    } else {
      completedTodos?.map(todo => {
        dispatch(updateTodo({ todoId: todo.id, todo: { completed: !todo.completed } }))
          .unwrap()
          .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todos was updated' })))
      })
    }
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = handleSubmit((data:IForm) => {
    if (data.title.trim() === '') {
      dispatch(appActions.enqueueSnackbar({
        key: uuid(), message: 'Field can\'t be empty',
        options: { variant: NotificationStatuses.Error }
      }));
      return;
    }
    setIsLoading(true);

    const nextData = {
      ...data,
      userId: currentUser?.id,
      completed: false,
    };

    dispatch(createTodo(nextData))
      .unwrap()
      .then(() => reset())
      .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todo was created' })))
      .finally(() => setIsLoading(false));
  });

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <Controller
          control={control}
          // rules={{ required: true, validate: (value: string) => value.trim() !== '' }}
          name="title"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isLoading}
              fullWidth
              // required
              placeholder="What needs to be done?"
              InputProps={{
                startAdornment: (
                  !!todos?.length && (
                    <IconButton onClick={selectAll} sx={{ color: !activeTodos?.length ? '#737373' : '#e6e6e6' }}>
                      <ExpandMoreIcon fontSize="large" />
                    </IconButton>
                  )
                ),
                endAdornment: (
                  isLoading && <CircularProgress />
                ),
              }}
            />
          )}
        />
      </form>
    </>
  );
};

export default TodosForm;

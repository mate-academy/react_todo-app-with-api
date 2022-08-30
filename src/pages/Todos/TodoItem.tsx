import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
// Hooks
import { useAppDispatch } from 'hooks/useAppDispatch';
// Async
import { deleteTodo, updateTodo } from 'store/todos/todosAsync';
// Actions
import { appActions } from 'store/app/appSlice';
// Models
import ITodo from 'models/Todo';
// MUI
import { makeStyles } from '@mui/styles';
import {
  Box, Card, CircularProgress, IconButton, TextField, Typography,
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  CircleOutlined as CircleOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from '@mui/icons-material';

type Props = {
  todo: ITodo;
};

const TodoItem:React.FC<Props> = ({ todo }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleRemoveTodo = () => {
    setIsLoading(true);

    dispatch(deleteTodo(todo.id))
      .unwrap()
      .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todo was deleted' })))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateStatus = (e: any) => {
    e.stopPropagation();
    setIsLoading(true);

    dispatch(updateTodo({ todoId: todo.id, todo: { completed: !todo.completed } }))
      .unwrap()
      .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todo was updated' })))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateTitle = (e: any) => {
    const { value: title } = e.target;

    if (title === todo.title) {
      setEditMode(false);

      return;
    }

    setIsLoading(true);

    if (!!title.trim()) {
      dispatch(updateTodo({ todoId: todo.id, todo: { title } }))
        .unwrap()
        .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todo was updated' })))
        .finally(() => setIsLoading(false));
    } else {
      handleRemoveTodo();
    }

    setEditMode(false);
  };

  const handleKeyDown = (e:any) => {
    const { value: title } = e.target;

    if (e.key === 'Escape') {
      setEditMode(false);

      return;
    }

    if (e.key === 'Enter' && title !== todo.title) {
      setIsLoading(true);

      dispatch(updateTodo({ todoId: todo.id, todo: { title } }))
        .unwrap()
        .then(() => setEditMode(false))
        .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todo was updated' })))
        .finally(() => setIsLoading(false));
    } else if (e.key === 'Enter' && title.trim() === '') {
      handleRemoveTodo();
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  return (
    <Card
      onDoubleClick={handleEditMode}
      sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, mt: 0.5, mb: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton disabled={isLoading} onClick={handleUpdateStatus}>
          {todo.completed ? <CheckCircleOutlineIcon color="success" /> : <CircleOutlinedIcon /> }
        </IconButton>
        {editMode ? (
          <TextField
            inputRef={input => input && input.focus()}
            defaultValue={todo.title}
            onBlur={handleUpdateTitle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Typography className={classes.title}>
            {todo.title}
          </Typography>
        )}
        {isLoading && <CircularProgress size={24} />}
      </Box>
      {!editMode && (
        <IconButton
          disabled={isLoading}
          className={classes.deleteBtn}
          onClick={handleRemoveTodo}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      )}

    </Card>
  );
};

export default TodoItem;

const useStyles = makeStyles({
  title: {
    fontSize: '18px',
    fontWeight: 500,
  },
  deleteBtn: {
    transition: 'color 0.3s',
    '&:hover': {
      color: 'rgb(211, 47, 47)',
    },
  },
});

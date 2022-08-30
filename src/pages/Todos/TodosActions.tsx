import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
// Hooks
import { useAppDispatch } from 'hooks/useAppDispatch';
// Models
import ITodo from 'models/Todo';
// Types
import FilterTypes from 'types/FilterTypes';
// Async
import { deleteTodo } from 'store/todos/todosAsync';
// Actions
import { appActions } from 'store/app/appSlice';
import { todosActions } from 'store/todos/todosSlice';
// Selectors
import {
  selectActiveTodos, selectCompletedTodos, selectFilter, selectTodos
} from 'store/todos/todosSelectors';
// MUI
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';

const TodosActions:React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const todos: ITodo[] | null = useSelector(selectTodos);
  const activeTodos: ITodo[] | null = useSelector(selectActiveTodos);
  const completedTodos: ITodo[] | null = useSelector(selectCompletedTodos);
  const activeFilter = useSelector(selectFilter);

  const handleFilter = (filter: FilterTypes | null) => {
    dispatch(todosActions.setFilter(filter));
  }

  const handleRemoveCompletedTodos = () => {
    completedTodos?.forEach(todo => {
      dispatch(deleteTodo(todo.id))
        .unwrap()
        .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: 'Todos was deleted' })))
    })
  }

  if (!todos || !todos.length) return null;

  return (
    <Box className={classes.footer}>
      <Box sx={{ flexBasis: '20%' }}>
        {!!activeTodos?.length && <Typography>{activeTodos?.length} items left</Typography>}
      </Box>
      <Box sx={{ flexBasis: '50%', display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonGroup>
          <Button
            size="small"
            color={activeFilter === null ? 'primary' : 'inherit'}
            variant={activeFilter === null ? 'contained' : 'outlined'}
            onClick={() => handleFilter(null)}
          >All</Button>
          <Button
            size="small"
            color={activeFilter === FilterTypes.Active ? 'primary' : 'inherit'}
            variant={activeFilter === FilterTypes.Active ? 'contained' : 'outlined'}
            onClick={() => handleFilter(FilterTypes.Active)}
          >Active</Button>
          <Button
            size="small"
            color={activeFilter === FilterTypes.Completed ? 'primary' : 'inherit'}
            variant={activeFilter === FilterTypes.Completed ? 'contained' : 'outlined'}
            onClick={() => handleFilter(FilterTypes.Completed)}
          >Completed</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ flexBasis: '30%', display: 'flex', justifyContent: 'flex-end' }}>
        {!!completedTodos?.length && (
          <Button
            size="small"
            color="inherit"
            onClick={handleRemoveCompletedTodos}
          >Clear completed</Button>
        )}
      </Box>
    </Box>
  );
};

export default TodosActions;

const useStyles = makeStyles({
  footer: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#777',
    boxShadow: `0 1px 1px rgb(0 0 0 / 20%),
                0 8px 0 -3px #f6f6f6,
                0 9px 1px -3px rgb(0 0 0 / 20%),
                0 16px 0 -6px #f6f6f6,
                0 17px 2px -6px rgb(0 0 0 / 20%)`,

  }
})

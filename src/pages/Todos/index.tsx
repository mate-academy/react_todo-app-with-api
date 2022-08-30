import React from 'react';
// MUI
import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
// Components
import TodosActions from './TodosActions';
import TodosForm from './TodosForm';
import TodosList from './TodosList';

const TodosPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.page} variant="elevation" elevation={6}>
      <TodosForm />
      <TodosList />
      <TodosActions />
    </Paper>
  );
};

export default TodosPage;

const useStyles = makeStyles({
  page: {
    margin: '100px auto 0',
    width: '600px',
    maxWidth: '100%',
  },
});

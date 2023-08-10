import {
  ChangeEvent,
  FC,
  useContext,
  useState,
} from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { TodoContext } from '../context/TodoContext';
import { ErrorType } from '../types/HelperTypes';

type Props = {
  setErrorType: (value: ErrorType) => void;
};

export const LoginForm: FC<Props> = ({ setErrorType }) => {
  const [value, setValue] = useState('imarchuk90@gmail.com');
  const { handleUserId } = useContext(TodoContext);

  const handleInputChanges = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const trimedValue = value.trim();

      if (trimedValue) {
        await handleUserId(trimedValue);
      } else {
        setErrorType(ErrorType.EMPTY_FIELD);
      }
    } catch {
      setErrorType(ErrorType.WRONG_EMAIL);
    }
  };

  return (
    <Paper elevation={3} className="section LoginForm">
      <Typography variant="h5" component="h1">
        Log in to open todos
      </Typography>

      <form action="submit" onSubmit={handleSubmit}>
        <Typography variant="h4" component="h3">
          Email
        </Typography>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          className="custom-input"
          type="text"
          value={value}
          onChange={handleInputChanges}
          placeholder="Enter your email"
        />
        <Button type="submit" variant="contained">
          Log In
        </Button>
      </form>
    </Paper>
  );
};

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

type UserIdState = number | null;
type UserIdDispatch = Dispatch<SetStateAction<UserIdState>>;

export const useUserId = (): [UserIdState, UserIdDispatch] => {
  const [userId, setUserId] = useState<UserIdState>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      localStorage.setItem('userId', userId.toString());
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return [userId, setUserId];
};

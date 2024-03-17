import { useReducer } from 'react';
import { Filtering } from '../../types/Filtering';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Action {
  type: Filtering;
  payload?: number | Todo | Todo[];
}

const reducer = (state: Todo[], action: Action) => {
  switch (action.type) {
    case Filtering.Add:
      return [...state, action.payload as Todo];
    case Filtering.Toggle:
      return state.map(todo => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    case Filtering.Remove:
      return state.filter(elem => {
        return elem.id !== action.payload;
      });
    case Filtering.ChengeInput:
      return state.map(todo => {
        if (todo.id === (action.payload as Todo).id) {
          return { ...todo, title: (action.payload as Todo).title };
        }

        return todo;
      });
    case Filtering.Fetch:
      return action.payload;
    default:
      return state;
  }
};

export const useCustomReducer = () => {
  const [state, dispatch] = useReducer(reducer, []);

  const filterItems = (filterType: Filtering) => {
    switch (filterType) {
      case Filtering.All:
        return state;
      case Filtering.Active:
        return state.filter((todo: Todo) => !todo.completed);
      case Filtering.Complete:
        return state.filter((todo: Todo) => todo.completed);
      default:
        return state;
    }
  };

  const addItem = (todo: Todo) => {
    dispatch({ type: Filtering.Add, payload: todo });
  };

  const toggle = (id: number) => {
    dispatch({ type: Filtering.Toggle, payload: id });
  };

  const remove = (id: number) => {
    dispatch({ type: Filtering.Remove, payload: id });
  };

  const changeInput = (todo: Todo) => {
    dispatch({ type: Filtering.ChengeInput, payload: todo });
  };

  const fetchData = (dataFromServer: Todo) => {
    dispatch({ type: Filtering.Fetch, payload: dataFromServer });
  };

  return {
    state,
    filterItems,
    addItem,
    toggle,
    remove,
    changeInput,
    dispatch,
    fetchData,
  };
};

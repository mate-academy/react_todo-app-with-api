import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosState } from '../types/TodosState';
import { FormState } from '../types/FormState';
import { Dispatchers } from '../types/enums/Dispatchers';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from '../api/todos';
import { Errors } from '../types/enums/Errors';
import { Actions } from '../types/Actions';

const USER_ID = 11806;

// #region Initials
const initialTodosState: TodosState = {
  todos: [],
  dispatcher: () => { },
  errorType: null,
  tempTodo: null,
  activeTodoIds: [],
  clearErrorMessage: () => { },
};

const initialFormState: FormState = {
  formValue: '',
  onSetFormValue: () => [],
  disabledInput: false,
  inputRef: null,
};

const localInitial: Todo[] = [];
// #endregion

export const TodosContext = React.createContext(initialTodosState);
export const FormControlContext = React.createContext(initialFormState);

type Props = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(localInitial);
  const [errorType, setErrorType] = useState<Errors | null>(null);

  const [formValue, setFormValue] = useState('');
  const [disabledInput, setDisabled] = useState(false);

  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [
    tempTodo,
    setTempTodo,
  ] = useState<Todo | null>(null);

  const newErrorTimeout = (errorName: Errors) => {
    setErrorType(errorName);
    const timeout = setTimeout(() => {
      setErrorType(null);
    }, 3000);

    setErrorTimeout(timeout);
  };

  const clearErrorMessage = () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorType(null);
    }
  };

  const onSetFormValue = (val: string) => {
    setFormValue(val);
  };

  const reducer = async (state: Todo[], action: Actions) => {
    switch (action.type) {
      case Dispatchers.Load:
        try {
          const todosFromServer = await getTodos(USER_ID);

          setTodos(todosFromServer);
        } catch (error) {
          newErrorTimeout(Errors.GET);
        }

        break;

      case Dispatchers.Add: {
        const createdTodo = action.payload;

        if (!createdTodo.title) {
          newErrorTimeout(Errors.EMPTY);

          return;
        }

        setDisabled(true);

        setTempTodo({
          ...createdTodo,
          id: 0,
          updatedAt: '',
          createdAt: '',
        });

        try {
          const newTodo = await addTodo(action.payload);

          setTodos([
            ...state,
            newTodo,
          ]);
          setTempTodo(null);
          setFormValue('');
        } catch (error) {
          setTempTodo(null);
          newErrorTimeout(Errors.POST);
        } finally {
          setDisabled(false);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        }
      }

        break;

      case Dispatchers.DeleteComplited: {
        const todosIds = [...state]
          .filter(todo => todo.completed)
          .map(todo => todo.id);

        setActiveTodoIds(prev => [...prev, ...todosIds]);

        Promise
          .allSettled(todosIds.map(id => deleteTodo(id)))
          .then(res => {
            res.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                setTodos(prev => [...prev]
                  .filter(todo => todo.id !== todosIds[index]));
              }

              if (result.status === 'rejected') {
                newErrorTimeout(Errors.DELETE);
              }
            });
          })
          .finally(() => {
            setActiveTodoIds([]);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          });
      }

        break;

      case Dispatchers.DeleteWithId:
        setActiveTodoIds(prev => [...prev, action.payload]);

        try {
          await deleteTodo(action.payload);

          setTodos([...state].filter(todo => todo.id !== action.payload));
        } catch (error) {
          newErrorTimeout(Errors.DELETE);
        } finally {
          setActiveTodoIds(
            prev => [...prev].filter(id => id !== action.payload),
          );
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }

        break;

      case Dispatchers.UpdateTodo: {
        const { id } = action.payload;

        setActiveTodoIds(prev => [...prev, id]);

        let updatedTodo: Todo;

        try {
          if ('title' in action.payload) {
            const { title } = action.payload;

            updatedTodo = await updateTodo(id, { title });
          }

          if ('completed' in action.payload) {
            const { completed } = action.payload;

            updatedTodo = await updateTodo(id, { completed: !completed });
          }

          setTodos([...state].map(todo => {
            if (todo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return todo;
          }));
        } catch (error) {
          newErrorTimeout(Errors.PATCH);
        } finally {
          setActiveTodoIds(
            prev => [...prev].filter(idInList => idInList !== id),
          );
        }
      }

        break;

      case Dispatchers.ChangeAllStatuses: {
        const todosIds = [...state]
          .filter(todo => todo.completed !== action.payload)
          .map(todo => todo.id);

        setActiveTodoIds(prev => [...prev, ...todosIds]);

        try {
          await Promise
            .all(todosIds
              .map(id => updateTodo(id, { completed: action.payload })));

          setTodos([...state].map(todo => {
            return {
              ...todo,
              completed: action.payload,
            };
          }));
        } catch (err) {
          newErrorTimeout(Errors.PATCH);
        } finally {
          setActiveTodoIds([]);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }

        break;

      default:
        break;
    }
  };

  const dispatcher = (action: Actions) => {
    return reducer(todos, action);
  };

  useEffect(() => {
    reducer(todos, { type: Dispatchers.Load });
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        dispatcher,
        errorType,
        tempTodo,
        activeTodoIds,
        clearErrorMessage,
      }}
    >
      <FormControlContext.Provider value={{
        formValue,
        onSetFormValue,
        disabledInput,
        inputRef,
      }}
      >
        {children}
      </FormControlContext.Provider>
    </TodosContext.Provider>
  );
};

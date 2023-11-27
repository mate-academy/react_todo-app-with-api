import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

interface InterfaceTodosContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredTodos: Todo[];
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;

  alarm: ErrorMessage,
  setAlarm: React.Dispatch<React.SetStateAction<ErrorMessage>>;

  tempTodo: null | Todo,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isTodoChange: boolean;
  setIsTodoChange: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemoveTodo: (val: Todo) => void;

  changingItems: number[];
  setChangingItems: React.Dispatch<React.SetStateAction<number[]>>;
}

type Props = {
  children: React.ReactNode,
};

export const TodosContext = React.createContext<InterfaceTodosContext>({
  todos: [],
  setTodos: () => {},
  filteredTodos: [],
  setFilteredTodos: () => {},

  alarm: ErrorMessage.Default,
  setAlarm: () => {},

  tempTodo: null,
  setTempTodo: () => {},
  isTodoChange: false,
  setIsTodoChange: () => {},
  handleRemoveTodo: () => {},

  changingItems: [],
  setChangingItems: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const [alarm, setAlarm] = useState(ErrorMessage.Default);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isTodoChange, setIsTodoChange] = useState(false);

  const [changingItems, setChangingItems] = useState<number[]>([]);

  const handleRemoveTodo = (todo: Todo) => {
    setIsTodoChange(true);
    setChangingItems(current => [...current, todo.id]);
    removeTodo(todo.id)
      .then(() => {
        setFilteredTodos(todos.splice(todos.indexOf(todo), 1));
      })
      .catch(() => setAlarm(ErrorMessage.isUnableDeleteTodo))
      .finally(() => {
        setFilteredTodos(todos);
        setIsTodoChange(false);
        setChangingItems([]);
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filteredTodos,
      setFilteredTodos,

      alarm,
      setAlarm,

      tempTodo,
      setTempTodo,

      isTodoChange,
      setIsTodoChange,

      handleRemoveTodo,

      changingItems,
      setChangingItems,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

// import React, { useMemo, useState } from 'react';
// // import { Todo } from '../../components/Todo/Todo';
// import { Todo } from '../../types/Todo';

// interface TodosContextProps {
//   todos: Todo[],
//   setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
// }

// export const TodosContext = React.createContext<TodosContextProps>({
//   todos: [],
//   setTodos: (todos: Todo[]) => { },
// });

// interface Props {
//   children: React.ReactNode,
// }

// export const TodoProvider: React.FC<Props> = ({ children }) => {
//   const [todos, setTodos] = useState<Todo[]>([]);

//   // const value = useMemo(() => ({
//   //   todos,
//   //   setTodos,
//   // }), [todos]);

//   // console.log(value)

//   return (
//     <TodosContext.Provider value={{ todos, setTodos }}>
//       {children}
//     </TodosContext.Provider>
//   );
// };

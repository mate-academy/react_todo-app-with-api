// import React, { PropsWithChildren } from 'react';
// import { Todo } from '../types/Todo';

// interface FetchContextType {
//   deleteTodos: (id: number) => Promise<void>;
//   updateTodoComplete: (id: number, data: Partial<Todo>) => Promise<void>;
// }

// export const FetchContext = React.createContext<FetchContextType | null>(null);

// export const FetchProvider: React.FC<PropsWithChildren> = ({ children }) => {
//   const deleteTodos = async (id: number): Promise<void> => {
//     setIsLoading(true);
//     try {
//       if (deleteTodoID) {
//         await deleteTodo(deleteTodoID);

//         setTodos(prevTodos => prevTodos.filter(
//           ({ id }) => id !== deleteTodoID,
//         ));
//         setDeleteTodoID(null);
//       }
//     } catch (error) {
//       setErrorMessage('Unable to delete a todo');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <FetchContext.Provider value={{ deleteTodos, updateTodoComplete }}>
//       {children}
//     </FetchContext.Provider>
//   );
// };

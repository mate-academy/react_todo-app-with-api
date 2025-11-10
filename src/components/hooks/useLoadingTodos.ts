import { useState, useCallback } from "react";
import { Todo } from "../../types/Todo";

export const useLoadingTodos = () => {
     const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);

       const handleAddTodoToLoading = useCallback(
        (todoId: Todo['id']) => {
         setLoadingTodoIds(currentLoading => [...currentLoading, todoId]);
       }, [] )

     
       const handleRemoveTodoToLoading = useCallback(
        (todoId: Todo['id']) => {
         setLoadingTodoIds(currentLoading =>
           currentLoading.filter(id => id !== todoId),
         );
       }, []
    )

return {
loadingTodoIds,
handleAddTodoToLoading,
handleRemoveTodoToLoading
}
}
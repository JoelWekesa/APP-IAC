import ApiClient from "@/config/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface Delete {
    id: string
    token: string
}


const deleteTodo = async ({ id, token }: Delete) => {
    const url = `todo?id=${id}`

    const instance = await ApiClient({ token })

    const todo = await instance.delete(url).then(res => res.data)

    return todo

}

const useDeleteTodo = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTodo,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })
}

export default useDeleteTodo
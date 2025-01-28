import ApiClient from "@/config/axios"
import { Auth } from "./get-todos"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface Update {
    title: string
    id: string
    completed: boolean
}


const updateTodo = async ({ data, auth: { token } }: { data: Update, auth: Auth }) => {
    const url = 'todo'

    const instance = await ApiClient({ token })

    const todo = await instance.patch(url, data).then(res => res.data)

    return todo

}

const useUpdateTodo = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateTodo,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })
}

export default useUpdateTodo
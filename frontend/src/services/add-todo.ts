import ApiClient from "@/config/axios"
import { Auth } from "./get-todos"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface Add {
    title: string
}


const addTodo = async ({ data, auth: { token } }: { data: Add, auth: Auth }) => {
    const url = 'todo'

    const instance = await ApiClient({ token, })

    const todo = await instance.post(url, data).then(res => res.data)

    return todo

}

const useAddTodo = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addTodo,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })
}

export default useAddTodo
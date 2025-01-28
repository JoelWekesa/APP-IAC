import ApiClient from "@/config/axios"
import { Todo } from "@/models/todo"
import { useQuery } from "@tanstack/react-query"

export interface Auth {
    token: string
}

const getTodos = async ({ token }: Auth) => {

    const url = 'todo/user'

    const instance = await ApiClient({ token, })

    const todos: Todo[] = await instance.get(url).then(res => res.data)

    return todos

}


const useTodos = ({ token }: Auth) => useQuery({
    queryKey: ['todos', { token }],
    queryFn: () => getTodos({ token }),
    enabled: !!token
})

export default useTodos
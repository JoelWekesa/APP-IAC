import ApiClient from "@/config/axios"
import { Todo } from "@/models/todo"
import { useQuery } from "@tanstack/react-query"

export interface Auth {
    token: string
    baseURL: string
}

interface Props {
    auth: Auth
    todo: Todo
}

const getTodos = async ({ auth: { token }, todo: { id } }: Props) => {

    const url = `todo?id=${id}`

    const instance = await ApiClient({ token })

    const todos: Todo = await instance.get(url).then(res => res.data)

    return todos

}


const useTodo = ({ auth, todo }: Props) => useQuery({
    queryKey: ['todos', { id: todo.id }],
    queryFn: () => getTodos({ auth, todo }),
    initialData: todo,
    enabled: !!auth.token
})

export default useTodo
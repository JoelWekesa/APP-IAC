import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UserHelper } from './user.helper';
import { UpdateTodoDto } from './dto/update-todo.dto';


@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }
  async create(createTodoDto: CreateTodoDto) {
    const { title } = createTodoDto;
    const userId = await this.userHelper.getUserId();

    const newTodo = await this.prisma.todo.create({
      data: {
        title,
        userId
      }
    }).then((todo) => {

      return todo;
    }).catch(err => {

      throw new BadRequestException(err.message);
    })

    return newTodo;

  }

  async findUserTodos() {
    const userId = await this.userHelper.getUserId();

    const todos = await this.prisma.todo.findMany({
      where: {
        userId
      },

      orderBy: [
        {
          completed: 'asc'
        },
        {
          updatedAt: 'desc'
        }
      ]
    }).then(todos => {
      return todos;
    }).catch(err => {
      throw new BadRequestException(err.message);
    })

    return todos;
  }

  async updateTodo({ id, ...data }: UpdateTodoDto) {
    const updated = await this.prisma.todo.update({
      where: { id },
      data
    }).then(todo => {

      return todo;
    }).catch(err => {
      throw new BadRequestException(err.message);
    })

    return updated;

  }

  async deleteTodo({ id }: UpdateTodoDto) {
    const deleted = await this.prisma.todo.delete({
      where: { id }
    }).then(todo => {

      return {
        message: `Todo with title ${todo.title} has been deleted`
      }
    }).catch(err => {
      throw new BadRequestException(err.message);
    })

    return deleted;
  }


  async getTodo({ id }: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({
      where: { id }
    }).then(todo => {

      return todo
    }).catch(err => {
      throw new BadRequestException(err.message);
    })

    return todo;
  }

}

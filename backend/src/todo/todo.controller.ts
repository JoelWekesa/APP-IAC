import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get('user')
  findUserTodos() {
    return this.todoService.findUserTodos();
  }

  @Get()
  getTodo(@Query() query: UpdateTodoDto) {
    return this.todoService.getTodo(query);
  }


  @Patch()
  update(@Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo(updateTodoDto);
  }


  @Delete()
  delete(@Query() updateTodoDto: UpdateTodoDto) {
    return this.todoService.deleteTodo(updateTodoDto);
  }

}

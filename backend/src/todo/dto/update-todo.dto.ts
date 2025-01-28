import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsBoolean()
    completed: boolean;
}

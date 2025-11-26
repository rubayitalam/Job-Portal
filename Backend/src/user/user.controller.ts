import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: UserDto) {
    return await this.userService.create(userDto);
  }

  @Get()
  async findAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { 
    return await this.userService.findById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updates: Partial<UserDto>) { 
    return await this.userService.update(id, updates);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
// {
//   "name": "John",
//   "email": "john@example.com",
//   "password": "123456"
// }

// POST    /users
// GET     /users
// GET     /users/:id
// PUT     /users/:id
// DELETE  /users/:id

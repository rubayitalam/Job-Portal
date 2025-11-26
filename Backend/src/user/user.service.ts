import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Hash password
  async create(userData: Partial<User>) {
    if (!userData.password) {
      throw new Error('Password is required'); 
    }

    const saltRounds = 10; // bcriptr
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword; 

    const user = this.userRepo.create(userData);
    return await this.userRepo.save(user);
  }

  // Find user by email
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Validate user password login
  async validatePassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword); 
  }

  // Find user by ID
  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update user by ID
  async update(id: number, updates: Partial<User>) {
    const user = await this.findById(id); 
    await this.userRepo.update(id, updates);
    return { ...user, ...updates }; 
  }

  // Delete user by ID
  async delete(id: number) {
    const user = await this.findById(id);
    await this.userRepo.delete(id);
    return { message: `User with ID ${id} has been deleted` };
  }

  // Get all users
  async getAll() {
    return await this.userRepo.find();
  }
}

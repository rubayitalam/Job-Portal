
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User1 } from './user1.entity'; 
import { AuthDto, JwtPayload } from './auth.dto'; 
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User1) private usersRepository: Repository<User1>,
  ) {}

  // Validate User for login
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Login function to generate JWT token
  async login(authDto: AuthDto) {
    const user = await this.usersRepository.findOne({ where: { username: authDto.username } });
    if (user && bcrypt.compareSync(authDto.password, user.password)) {
      const { password, ...result } = user;
      const payload: JwtPayload = { username: user.username, sub: user.id, role: user.role };
      
      // Generate the JWT token
      const access_token = this.jwtService.sign(payload);

      return {
      // access_token,
      message:'login sucessfull',
      user:{

        userId:user.id,
        username:user.username,
        role:user.role
      },


      access_token:access_token,
      };
    }
    return null;
  }

  // Register method to handle user registration
  async register(dto: AuthDto): Promise<User1> {
    const existingUser = await this.usersRepository.findOne({ where: { username: dto.username } });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
      role: dto.role || 'user', // optional: default role
    });

    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}

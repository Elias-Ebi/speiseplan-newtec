import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data/entitites/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './models/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string, name: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // email already exists
    if (user) {
      throw new ConflictException('E-Mail already registered');
    }

    return this.userRepository.save({
      email,
      password,
      name,
    });
  }

  validateUser(email: string, password: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, password },
    });
  }

  login(user: User): { accessToken: string } {
    const payload: JwtPayload = {
      sub: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

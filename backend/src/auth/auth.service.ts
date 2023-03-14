import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data/entitites/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { JwtPayload } from './models/jwt-payload';
import { AuthUser } from './models/AuthUser';
import { Profile } from '../data/entitites/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>
  ) {
  }

  async register(email: string, password: string, name: string): Promise<Profile> {
    const options: FindOneOptions<User> = {
      where: { email }
    };

    const user = await this.userRepository.findOne(options);

    if (user) {
      throw new ConflictException('E-Mail already registered');
    }

    const newUser: User = { email, password };
    const newProfile: Profile = { email, name, isAdmin: false };
    await Promise.all([this.userRepository.save(newUser), this.profileRepository.save(newProfile)]);

    return newProfile;
  }

  validateUser(email: string, password: string): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { email, password }
    };

    return this.userRepository.findOne(options);
  }

  async login(user: AuthUser): Promise<{ accessToken: string }> {
    const profile = await this.getProfile(user.email);

    const payload: JwtPayload = {
      sub: user.email,
      isAdmin: profile.isAdmin
    };

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async getProfile(email: string): Promise<Profile> {
    const options: FindOneOptions<Profile> = {
      where: { email }
    };

    const profile = await this.profileRepository.findOne(options);

    if (!profile) {
      throw new UnauthorizedException('Profile not found!');
    }

    return profile;
  }

  async getAllAdminProfiles(): Promise<Profile[]> {
    const options: FindManyOptions<Profile> = {
      where: { isAdmin: true }
    };

    const profiles = await this.profileRepository.find(options);

    return profiles;
  }

  async getAllNonAdminProfiles(): Promise<Profile[]> {
    const options: FindManyOptions<Profile> = {
      where: { isAdmin: false }
    };

    const profiles = await this.profileRepository.find(options);
    
    return profiles;
  }

  async toggleAdminAccess(concernedUser: string): Promise<Profile> {
    const options: FindOneOptions<Profile> = {
      where: { email: concernedUser }
    };
    const profile = await this.profileRepository.findOne(options);
    
    if (!profile) {
      throw new UnauthorizedException('Profile not found!');
    } else {
      profile.isAdmin = !profile.isAdmin;
      return this.profileRepository.save(profile);
    }
  }
}

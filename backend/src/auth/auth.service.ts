import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/data/entitites/user.entity';
import {FindManyOptions, FindOneOptions, Repository} from 'typeorm';
import {JwtPayload} from './models/jwt-payload';
import {AuthUser} from './models/AuthUser';
import {Profile} from '../data/entitites/profile.entity';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
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

  async resetPassword(email: string) {
    const options: FindOneOptions<User> = {
      where: { email }
    };

    const result = await this.userRepository.findOne(options);

    if(!result) {
      return false;
    }
    
    this.emailService.sendResetPasswordMail(email);
    
    return true;
  }

  async getUser(email: string): Promise<User>{
    const options: FindOneOptions<User> = {
      where: { email }
    };

    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
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

  async changeName(user: AuthUser, name: string): Promise<Profile> {
    if (!name) {
      throw new BadRequestException("name must not be empty");
    }

    const profile = await this.getProfile(user.email);
    profile.name = name;
    return this.profileRepository.save(profile);
  }

  async changePassword(authUser: AuthUser, current: string, newPassword: string) {
    if (!newPassword) {
      throw new BadRequestException("New Password must not be empty");
    }

    const user = await this.getUser(authUser.email);

    if (user.password !== current) {
      throw new BadRequestException('Wrong password');
    }

    user.password = newPassword;

    await this.userRepository.save(user);
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  async getAllAdminProfiles(): Promise<Profile[]> {
    const options: FindManyOptions<Profile> = {
      where: {isAdmin: true}
    };

    return await this.profileRepository.find(options);
  }

  async getAllNonAdminProfiles(): Promise<Profile[]> {
    const options: FindManyOptions<Profile> = {
      where: { isAdmin: false }
    };

    return await this.profileRepository.find(options);
  }

  async toggleAdminAccess(email: string): Promise<Profile> {
    const adminsP = this.getAllAdminProfiles();
    const profileP = this.getProfile(email);

    const [admins, profile] = await Promise.all([adminsP, profileP]);

    if (admins.length === 1 && profile.isAdmin) {
      throw new BadRequestException('Can not delete last Admin of the system!');
    }

    profile.isAdmin = !profile.isAdmin;

    return this.profileRepository.save(profile);
  }
}

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
import { Temporal } from '@js-temporal/polyfill';
import { HashService } from 'src/shared/hash/hash.service';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
    private hashService: HashService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(ResetPasswordToken) private resetPasswordTokenRepository: Repository<ResetPasswordToken>
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

    const password_encrypted: string = this.hashService.encrypt(password, 1, "hex");

    const newUser: User = { email: email, password: password_encrypted };
    const newProfile: Profile = { email, name, isAdmin: false };
    await Promise.all([this.userRepository.save(newUser), this.profileRepository.save(newProfile)]);

    return newProfile;
  }

  validateUser(email: string, password: string): Promise<User | null> {
    const password_encrypted: string = this.hashService.encrypt(password, 1, "hex");

    const options: FindOneOptions<User> = {
      where: { email, password: password_encrypted }
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

    const user = await this.userRepository.findOne(options);

    if(!user) {
      return false;
    }

    // create a hash with the current time_stamp and user password
    const time_stamp: string = Temporal.Now.plainDateTimeISO().toString();
    const password: string = user.password;
    const hashstr: string = time_stamp + password;

    // create a hash to be used as a token
    const secret: string = this.hashService.encrypt(hashstr, 1, "hex");

    // save the token in the database
    await this.resetPasswordTokenRepository.save({email: email, token: secret, code: "-", updatedAt: Temporal.Now.plainDateTimeISO().toString()});

    // send email to the user
    this.emailService.sendResetPasswordMail(email, secret);
    
    return true;
  }

  async setPasswordFromToken(token: string, newPassword: string) {
    const reset_options: FindOneOptions<ResetPasswordToken> = {
      where: { token }
    };

    const resetPasswordToken: ResetPasswordToken = await this.resetPasswordTokenRepository.findOne(reset_options);

    if(!resetPasswordToken) {
      throw new NotFoundException();
    }

    const user_options: FindOneOptions<User> = {
      where: { email: resetPasswordToken.email }
    };

    const user: User = await this.userRepository.findOne(user_options);

    if(!user) {
      throw new NotFoundException();
    }

    if(!this.hashService.timeSafeEqual(user.password, newPassword)) {
      throw new BadRequestException("The new password must be different from the old one");
    }

    user.password = this.hashService.encrypt(newPassword, 1, "hex");

    await this.userRepository.save(user);
  }

  async resetPasswordWithCode(email: string) {
    const options: FindOneOptions<User> = {
      where: { email }
    };

    const user = await this.userRepository.findOne(options);

    if(!user) {
      return false;
    }

    const code: string = this.hashService.createCustomLengthVerificationCode(6);

    // save the code in the database
    await this.resetPasswordTokenRepository.save({email: email, token: "-", code: code, updatedAt: Temporal.Now.plainDateTimeISO().toString()});

    // send email to the user
    this.emailService.sendVerificationMail(email, code);
    
    return true;
  }

  async checkVerificationCode(code: string) {
    const reset_options: FindOneOptions<ResetPasswordToken> = {
      where: { code }
    };

    const resetPasswordToken: ResetPasswordToken = await this.resetPasswordTokenRepository.findOne(reset_options);

    return resetPasswordToken ? true : false;
  }

  async setPasswordFromVerificationCode(code: string, newPassword: string) {
    const reset_options: FindOneOptions<ResetPasswordToken> = {
      where: { code }
    };

    const resetPasswordToken: ResetPasswordToken = await this.resetPasswordTokenRepository.findOne(reset_options);

    if(!resetPasswordToken) {
      throw new NotFoundException();
    }

    const user_options: FindOneOptions<User> = {
      where: { email: resetPasswordToken.email }
    };

    const user: User = await this.userRepository.findOne(user_options);

    if(!user) {
      throw new NotFoundException();
    }

    /*
    if(!this.hashService.timeSafeEqual(user.password, newPassword)) {
      throw new BadRequestException("The new password must be different from the old one");
    }
    */

    user.password = this.hashService.encrypt(newPassword, 1, "hex");

    await this.userRepository.save(user);
    await this.resetPasswordTokenRepository.delete(resetPasswordToken);

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
    const newPassword_encrypted = this.hashService.encrypt(newPassword, 1, "hex");
    const current_encrypted = this.hashService.encrypt(current, 1, "hex");

    if (!newPassword_encrypted) {
      throw new BadRequestException("New Password must not be empty");
    }

    const user = await this.getUser(authUser.email);

    if (user.password !== current_encrypted) {
      throw new BadRequestException('Wrong password');
    }

    user.password = newPassword_encrypted;

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

  async notifyUsers(): Promise<Profile[]> {
    const profiles = await this.profileRepository.find();

    if(!profiles) {
      return [];
    }

    profiles.forEach(profile => {
      this.emailService.notifyUsers(profile);
    });

    return profiles;
  }
}

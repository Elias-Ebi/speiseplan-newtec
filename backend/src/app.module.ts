import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { environment } from './environment';
import { AdminOnlyGuard } from './auth/guards/admin-only.guard';
import * as dotenv from 'dotenv'

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // neon cloud db
      type: 'postgres',
      url: environment.dbUrl,
      autoLoadEntities: true,
      synchronize: environment.synchronize,
      migrationsTableName: 'migrations',
      migrations: ['src/data/migrations/*{.ts,.js}'],
      migrationsRun: environment.migrationsRun,
      ssl: true

      // local docker + pgAdmin
      /*
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      migrationsTableName: 'migrations',
      migrations: ["src/data/migrations/*{.ts,.js}"],
      migrationsRun: false,
      ssl: false,
      */
    }),
    AuthModule,
    CoreModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: AdminOnlyGuard
    }
  ]
})
export class AppModule {
}

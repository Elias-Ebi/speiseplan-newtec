import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { environment } from './environment';
import { AdminOnlyGuard } from './auth/guards/admin-only.guard';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: environment.dbUrl,
      autoLoadEntities: true,
      synchronize: environment.synchronize,
      migrationsTableName: 'migrations',
      migrations: ["src/data/migrations/*{.ts,.js}"],
      migrationsRun: environment.migrationsRun,
      ssl: true
    }),
    AuthModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminOnlyGuard,
    },
  ],
})
export class AppModule {}

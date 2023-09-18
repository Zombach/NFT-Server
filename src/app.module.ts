import { Module } from '@nestjs/common';
import { UsersController } from './users/usersController';
import { UsersService } from './users/usersService';
import { DatabaseModule } from './database.module';
import { usersProviders } from './users/users.providers';
import { AuthService } from './auth/authService';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/authController';
import { collectionsProviders } from './collections/collections.providers';
import { CollectionsController } from './collections/collectionsController';
import { CollectionsService } from './collections/collectionsService';
import { productsProviders } from './products/products.providers';
import { ProductsService } from './products/productsService';
import { ProductsController } from './products/productsController';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '50000s' },
    }),
  ],
  controllers: [UsersController, AuthController, CollectionsController, ProductsController],
  providers: [...usersProviders, ...collectionsProviders, ...productsProviders, UsersService, AuthService, CollectionsService, ProductsService],
})
export class AppModule {}

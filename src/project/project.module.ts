import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from '#/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]),
    MulterModule.register(),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

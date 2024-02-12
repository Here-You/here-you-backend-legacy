// signature.comment.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { S3UtilService } from '../utils/S3.service';
import { SignatureService } from './signature.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SignatureCommentEntity } from './domain/signature.comment.entity';
import { UserEntity } from '../user/user.entity';
import { SignatureEntity } from './domain/signature.entity';

@Injectable()
export class SignatureCommentService{

  constructor(
    private readonly signatureService: SignatureService,
    private readonly userService: UserService,
    private readonly s3Service: S3UtilService,
  ) {}

  async createSignatureComment(createCommentDto: CreateCommentDto, userId: number, signatureId: number ){
    const comment = new SignatureCommentEntity();

    const user = await UserEntity.findOneOrFail({ where: { id: userId }});
    const signature = await SignatureEntity.findOneOrFail( { where: { id: signatureId }})

    if( !user || !signature ) {
      throw new NotFoundException('404 Not Found');
    }
    else {
      comment.user = user;
      comment.signature = signature;
      comment.content = createCommentDto.content;
      await comment.save();

      return comment.id;
    }
  }
}
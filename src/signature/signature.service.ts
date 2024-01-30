// signature.service.ts

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { SignatureEntity } from './signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class SignatureService {
  async createSignature(
    createSignatureDto: CreateSignatureDto,
  ): Promise<number> {
    const signature: SignatureEntity = await SignatureEntity.createSignature(
      createSignatureDto,
    );

    if (!signature) {
      throw new BadRequestException();
    }
    return signature.id;
  }

  /*
  async homeSignature(userId: number): Promise<HomeSignatureDto[]> {
    // 사용자 토큰 가져오기 구현
    const getByUserId = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.userId = :userId', {userId });

    const getUser = await getByUserId.getOne();
    if(!getUser){

    }
    
    console.log('홈 서비스 진입');
    const signatures: HomeSignatureDto[] = await SignatureEntity.findMySignature(userId);
    return signatures;
  }
  catch(error) {
    // 예외 처리
    throw new HttpException('Internal Server Error', 500);
  }
  */
}

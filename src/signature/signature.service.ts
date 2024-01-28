// signature.service.ts

import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { SignatureEntityRepository } from './signature.repository';
import { CreateSignatureDto } from './dto/create-signature.dto';
import SignatureEntity from './signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class SignatureService {
  constructor(
    @InjectRepository(SignatureEntity)
    private signatureRepository: SignatureEntityRepository,
  ) {}

  async homeSignature(userId: number): Promise<HomeSignatureDto[]> {
    /* 사용자 토큰 가져오기 구현
    const getByUserId = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.userId = :userId', {userId });

    const getUser = await getByUserId.getOne();
    if(!getUser){

    }
    */
    console.log('홈 서비스 진입');
    const signatures: HomeSignatureDto[] =
      await this.signatureRepository.findMySignature(userId);
    return signatures;
  }
  catch(error) {
    // 예외 처리
    throw new HttpException('Internal Server Error', 500);
  }

  async createSignature(newSignature: CreateSignatureDto): Promise<boolean> {
    const signature = await this.signatureRepository.createSignature(
      newSignature,
    );
    console.log(signature);
    if (signature == true) return true;
    else return false;
  }
}

// signature.service.ts

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { SignatureEntity } from './domain/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { UserEntity } from 'src/user/user.entity';
import { SignaturePageEntity } from './domain/signature.page.entity';
import { PageSignatureDto } from './dto/page-signature.dto';

@Injectable()
export class SignatureService {
  async createSignature(
    createSignatureDto: CreateSignatureDto,
  ): Promise<number> {

    // [1] 시그니처 저장
    const signature: SignatureEntity =
      await SignatureEntity.createSignature( createSignatureDto);

    if (!signature) {
      throw new BadRequestException();
    }

    else{
      // [2] 각 페이지 저장
      for(const pageSignatureDto of createSignatureDto.pages){
        await SignaturePageEntity.saveSignaturePages(pageSignatureDto, signature);
      }
    }

    return signature.id;
  }


  async homeSignature(user_id: number): Promise<HomeSignatureDto[]> {
    try {
      const homeSignatureList: HomeSignatureDto[] = await SignatureEntity.findMySignature(user_id);
      return homeSignatureList;

    } catch (error) {
      // 예외 처리
      console.error('Error on HomeSignature: ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

}

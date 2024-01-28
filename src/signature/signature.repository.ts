//signature.repository.ts

import { Repository, DataSource, EntityManager } from 'typeorm';
import SignatureEntity from './signature.entity';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignatureEntityRepository extends Repository<SignatureEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(SignatureEntity, entityManager);
  }

  async findMySignature(userId: number): Promise<HomeSignatureDto[]> {
    const signatures = await this.createQueryBuilder('signature')
      .leftJoinAndSelect('signature.owner', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    //결과를 HomeSignatureDto로 매핑
    const result: HomeSignatureDto[] = signatures.map((signature) => ({
      title: signature.title,
      date: signature.created,
      // 페이지 1장 사진 추가해야
    }));

    return result;
  }

  async createSignature(newSignature: CreateSignatureDto): Promise<boolean> {
    const { title } = newSignature;
    /*
    const signature = this.signatureRepository.create({
      title: title,
      liked_cnt: 0,
    });

    await this.signatureRepository.save(signature);
    */

    return true;
  }
}

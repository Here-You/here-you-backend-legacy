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
import { DetailSignatureDto } from './dto/detail-signature.dto';
import { AuthorSignatureDto } from './dto/author-signature.dto';
import { HeaderSignatureDto } from './dto/header-signature.dto';
import { UserService } from '../user/user.service';
import { SignatureLikeEntity } from './domain/signature.like.entity';

@Injectable()
export class SignatureService {

  constructor(private readonly userService: UserService) {}

  async createSignature(createSignatureDto: CreateSignatureDto): Promise<number> {

    // [1] 시그니처 저장
    const signature: SignatureEntity = await SignatureEntity.createSignature(createSignatureDto);

    if (!signature) throw new BadRequestException();
    else{ // [2] 각 페이지 저장
      for(const pageSignatureDto of createSignatureDto.pages){
        await SignaturePageEntity.saveSignaturePage(pageSignatureDto, signature);
      }
    }

    return signature.id;
  }


  async homeSignature(userId: number): Promise<HomeSignatureDto[]> {
    try {
      console.log("userId; ",userId);
      const homeSignatureList: HomeSignatureDto[] = await SignatureEntity.findMySignature(userId);
      return homeSignatureList;

    } catch (error) {
      // 예외 처리
      console.error('Error on HomeSignature: ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async checkIfLiked(user: UserEntity, signatureId: number): Promise<boolean> {
    // user가 해당 시그니처에 좋아요 눌렀는지 확인

    const likesArray = user.likes || [];

    const isLiked = likesArray.some(
      (signatureLike) => signatureLike.id === signatureId
    );

    return isLiked;
  }

  async detailSignature(userId: number, signatureId: number):Promise<DetailSignatureDto> {
    try{
      const detailSignatureDto:DetailSignatureDto = new DetailSignatureDto();

      // [1] 시그니처 객체, 로그인 유저 객체 가져오기
      const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
      if(signature == null) return null;
      console.log("시그니처 정보: ", signature);

      const loginUser:UserEntity = await this.userService.findUserById(userId);
      console.log("로그인한 유저 정보: ", loginUser);

      /****************************************/

      // [2] 시그니처 작성자 정보 가져오기
      const authorDto: AuthorSignatureDto = new AuthorSignatureDto();

      console.log("시그니처 작성자 id: ",signature.user.id);
      console.log("로그인한 유저 id: ",loginUser.id);
      // 본인의 시그니처면 빈 객체를, 다르면 작성자의 프로필 정보를 담는다
      if(loginUser.id != signature.user.id) {
        authorDto._id = signature.user.id;
        authorDto.name = signature.user.name;

        const image = await this.userService.getProfileImage(signature.user.id);
        console.log("시그니처 작성자 프로필 이미지: ",image);

        authorDto.image = image.imageKey;

        // 해당 시그니처 작성자를 팔로우하고 있는지 확인
        authorDto.is_followed = await this.userService.checkIfFollowing(loginUser,signature.user.id);
        detailSignatureDto.author = authorDto;
      }

      /****************************************/

      // [3] 시그니처 헤더 정보 담기
      const headerSignatureDto: HeaderSignatureDto = new HeaderSignatureDto();
      headerSignatureDto._id = signature.id;
      headerSignatureDto.title = signature.title;
      headerSignatureDto.like_cnt = signature.liked;

      // 발행일 가공하기
      const date = signature.created;
      headerSignatureDto.date = await SignatureEntity.formatDateString(date);

      // 해당 시그니처 좋아요 눌렀는지 확인하기
      headerSignatureDto.is_liked = await this.checkIfLiked(loginUser,signatureId);

      detailSignatureDto.header = headerSignatureDto;

      /****************************************/

      // [4] 각 페이지 내용 가져오기
      const signaturePageDto: PageSignatureDto[] = [];
      const pages: SignaturePageEntity[] = await SignaturePageEntity.findSignaturePages(signatureId);

      for(const page of pages){
        const pageDto:PageSignatureDto = new PageSignatureDto();
        pageDto._id = page.id;
        pageDto.page = page.page;
        pageDto.content = page.content;
        pageDto.image = page.image;
        pageDto.location = page.location;

        signaturePageDto.push(pageDto);
      }
      detailSignatureDto.pages = signaturePageDto;


      return detailSignatureDto;
    }
    catch(error){
      // 예외 처리
      console.error('Error on DetailSignature: ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findIfAlreadyLiked(userId: number, signatureId: number): Promise<SignatureLikeEntity> {

    const signatureLike = await SignatureLikeEntity.findOne({
      where:{
        user: { id: userId },
        signature: {id: signatureId}
      }
    });

    if(signatureLike) return signatureLike
    else null;

  }


  async addLikeOnSignature(userId: number, signatureId: number) {

    // [1] 시그니처 객체, 로그인 유저 객체 가져오기
    const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
    console.log("시그니처 정보: ", signature);

    const loginUser:UserEntity = await this.userService.findUserById(userId);
    console.log("로그인한 유저 정보: ", loginUser);

    // [2] 좋아요 테이블에 인스턴스 추가하기
    await SignatureLikeEntity.createLike(signature,loginUser);

    // [3] 해당 시그니처 좋아요 개수 추가하기
    signature.liked ++;
    await SignatureEntity.save(signature);

    return signature;

  }

  async deleteLikeOnSignature(signatureLike:SignatureLikeEntity, signatureId:number) {

    // [1] 해당 좋아요 기록 삭제
    const deleted_like = await SignatureLikeEntity.softRemove(signatureLike);

    // [2] 시그니처 좋아요 개수 -1
    const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
    signature.liked --;
    const newSignature = await SignatureEntity.save(signature);

    return signature;
  }

  async deleteSignature(signature){
    try{

      // [1] 페이지부터 삭제
      const deleteSignaturePages: SignaturePageEntity[] = await SignaturePageEntity.find({
        where:{ signature:{ id: signature.id } }
      });

      for( const deletePage of deleteSignaturePages ){
        await SignaturePageEntity.softRemove(deletePage);
      }

      // [2] 시그니처 삭제
      await SignatureEntity.softRemove(signature);

    }
    catch(error){
      console.log("Error on deleting Signature: ",error);
      throw error;
    }
  }

  async patchSignature(signatureId: number, patchSignatureDto: CreateSignatureDto) {

    // [1] 시그니처 객체 가져오기
    const signature:SignatureEntity = await SignatureEntity.findSignatureById(signatureId);
    if(signature == null) return null;
    console.log("시그니처 정보: ", signature);

    // [2] 시그니처 수정
    signature.title = patchSignatureDto.title;
    await SignatureEntity.save(signature);

    // [3] 기존 페이지 가져오기
    const originalSignaturePages: SignaturePageEntity[] = await SignaturePageEntity.find({
      where:{ signature:{ id: signature.id } }
    });

    // [4] 기존 페이지 수정 및 새로운 페이지 추가하기
    for(const patchedPage of patchSignatureDto.pages){
      if(!patchedPage._id){ // id가 없으면 새로 추가할 페이지
        await SignaturePageEntity.saveSignaturePage(patchedPage,signature);
      }
      for( const originalPage of originalSignaturePages ){
        if(patchedPage._id == originalPage.id){
          originalPage.content = patchedPage.content;
          originalPage.location = patchedPage.location;

          // 이미지 수정 필요
          originalPage.image = patchedPage.image;
        }
        await SignaturePageEntity.save(originalPage);
      }
    }

    return signatureId;

  }
}

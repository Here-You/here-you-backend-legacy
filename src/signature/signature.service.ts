// signature.service.ts

import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { SignatureEntity } from './domain/signature.entity';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { UserEntity } from 'src/user/user.entity';
import { SignaturePageEntity } from './domain/signature.page.entity';
import { PageSignatureDto } from './dto/page-signature.dto';
import { DetailSignatureDto } from './dto/detail-signature.dto';
import { AuthorSignatureDto } from './dto/author-signature.dto';
import { HeaderSignatureDto } from './dto/header-signature.dto';
import { UserService } from '../user/user.service';
import { SignatureLikeEntity } from './domain/signature.like.entity';
import { GetLikeListDto } from './dto/get-like-list.dto'
import { LikeProfileDto } from './dto/like-profile.dto';
import { S3UtilService } from '../utils/S3.service';
import { ResponsePageSignatureDto } from './dto/response-page-signature.dto';

@Injectable()
export class SignatureService {

  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3UtilService,
  ) {}

  async createSignature(createSignatureDto: CreateSignatureDto, userId: number): Promise<number> {
    try{
      // [1] 시그니처 저장
      const signature: SignatureEntity = await SignatureEntity.createSignature(createSignatureDto, userId);

      if (!signature) throw new BadRequestException();
      else{
        // [2] 각 페이지 저장
        try{
          for(const pageSignatureDto of createSignatureDto.pages){
            await this.saveSignaturePage(pageSignatureDto,signature);
          }
          return signature.id;

        }catch (e){

          // 만약 페이지 저장 중에 오류 발생해 저장이 중단되면 시그니처도 삭제하도록
          await this.deleteSignature(signature);
          console.log("Error on createSignatruePage: ", e);
          throw e;
        }
      }
    }
    catch(e){
      console.log("Error on createSignatrue: ", e);
      throw e;
    }
  }

  async saveSignaturePage(pageSignatureDto:PageSignatureDto, signature:SignatureEntity){
    const signaturePage:SignaturePageEntity = new SignaturePageEntity();

    signaturePage.signature = signature;
    signaturePage.content = pageSignatureDto.content;
    signaturePage.location = pageSignatureDto.location;
    signaturePage.page = pageSignatureDto.page;

    // 랜덤 이미지 키 생성
    const key = `signature/${this.s3Service.generateRandomImageKey('signaturePage.png')}`;

    // Base64 이미지 업로드
    const uploadedImage = await this.s3Service.putObjectFromBase64(
      key, pageSignatureDto.image
    );
    console.log(uploadedImage);

    signaturePage.image = key;

    await signaturePage.save();
  }


  async homeSignature(userId: number): Promise<HomeSignatureDto[]> {
    try {
      console.log("userId; ",userId);
      const homeSignatureList: HomeSignatureDto[] = await this.findMySignature(userId);
      return homeSignatureList;

    } catch (error) {
      // 예외 처리
      console.error('Error on HomeSignature: ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findMySignature(user_id: number):Promise<HomeSignatureDto[]> {
    const mySignatureList:HomeSignatureDto[] = [];
    const signatures = await SignatureEntity.find({
      where: { user: { id: user_id} },
    });

    for(const signature of signatures){
      const homeSignature:HomeSignatureDto = new HomeSignatureDto();

      homeSignature._id = signature.id;
      homeSignature.title = signature.title;
      homeSignature.date = signature.created;

      // 이미지 가져오기
      const imageKey = await SignaturePageEntity.findThumbnail(signature.id);
      homeSignature.image = await this.s3Service.getImageUrl(imageKey);

      mySignatureList.push(homeSignature);
    }
    return mySignatureList;
  }

  async checkIfLiked(user: UserEntity, signatureId: number): Promise<boolean> {
    const signatureLike = await SignatureLikeEntity.findOne({
      where:{
        user: { id: user.id },
        signature: {id: signatureId}
      }
    });
    if(signatureLike) return true;
    else return false;

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
      if(!authorDto){
        if(loginUser.id != signature.user.id) {
          authorDto._id = signature.user.id;
          authorDto.name = signature.user.nickname;

          const image = await this.userService.getProfileImage(signature.user.id);
          if(image == null) authorDto.image = null;
          else{
            authorDto.image = await this.s3Service.getImageUrl(image.imageKey);
          }

          // 해당 시그니처 작성자를 팔로우하고 있는지 확인
          authorDto.is_followed = await this.userService.checkIfFollowing(loginUser,signature.user.id);
          detailSignatureDto.author = authorDto;
        }
      }
      else{ // 해당 시그니처를 작성한 유저가 존재하지 않는 경우(탈퇴한 경우)
        console.log("유저가 존재하지 않습니다.");
        authorDto._id = null;
        authorDto.name = null;
        authorDto.image = null;
        authorDto.is_followed = null;
        detailSignatureDto.author = authorDto;
      }

      console.log("시그니처 작성자 id: ",signature.user.id);
      console.log("로그인한 유저 id: ",loginUser.id);
      // 본인의 시그니처면 빈 객체를, 다르면 작성자의 프로필 정보를 담는다

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
      const signaturePageDto: ResponsePageSignatureDto[] = [];
      const pages: SignaturePageEntity[] = await SignaturePageEntity.findSignaturePages(signatureId);

      for(const page of pages){
        const pageDto:ResponsePageSignatureDto = new ResponsePageSignatureDto();
        pageDto._id = page.id;
        pageDto.page = page.page;
        pageDto.content = page.content;
        pageDto.location = page.location;

        //이미지 가져오기
        pageDto.image = await this.s3Service.getImageUrl(page.image);

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
        await this.saveSignaturePage(patchedPage, signature);
      }
      for( const originalPage of originalSignaturePages ){
        if(patchedPage._id == originalPage.id){
          originalPage.content = patchedPage.content;
          originalPage.location = patchedPage.location;

          // 랜덤 이미지 키 생성
          const key = `signature/${this.s3Service.generateRandomImageKey('signaturePage.png')}`;

          // Base64 이미지 업로드
          const uploadedImage = await this.s3Service.putObjectFromBase64(
            key, patchedPage.image
          );

          // 이미지 키 저장
          console.log(uploadedImage);
          originalPage.image = key;

        }
        await SignaturePageEntity.save(originalPage);
      }
    }
    return signatureId;

  }


  async getSignatureLikeList(userId: number, signatureId: number): Promise<GetLikeListDto> {

    try{
      const signature = await SignatureEntity.findSignatureById(signatureId);
      if(!signature) {
        throw new NotFoundException(`Signature with ID ${signatureId} not found`);
      }

      const getLikeListDto: GetLikeListDto = new GetLikeListDto();

      const signatureLikeEntities = await SignatureLikeEntity.findSignatureLikes(signatureId);

      // 총 좋아요 개수
      getLikeListDto.liked = signatureLikeEntities.length;

      const likeProfileDtos: LikeProfileDto[] = [];

      for(const signatureLikeEntity of signatureLikeEntities){
        const likeProfileDto = new LikeProfileDto();


        if (signatureLikeEntity.user) {

          likeProfileDto._id = signatureLikeEntity.user.id;
          likeProfileDto.introduction = signatureLikeEntity.user.introduction;
          likeProfileDto.nickname = signatureLikeEntity.user.nickname;

          // 프로필 이미지 꺼내오기
          const image = await this.userService.getProfileImage(signatureLikeEntity.user.id);
          if(image == null)likeProfileDto.image = null;
          else{
            const userImageKey = image.imageKey;
            likeProfileDto.image = await this.s3Service.getImageUrl(userImageKey);
          }

          // 만약 좋아요 누른 사용자가 본인이 아니라면 is_followed 값을 체크하고 본인이면 null로 보내준다.
          if(signatureLikeEntity.user.id != userId){
            const loginUser= await this.userService.findUserById(userId);
            likeProfileDto.is_followed = await this.userService.checkIfFollowing(loginUser,signatureLikeEntity.user.id);
          }
          else likeProfileDto.is_followed = null;
          likeProfileDtos.push(likeProfileDto);
        }
      }
      getLikeListDto.profiles = likeProfileDtos;

      return getLikeListDto;

    }catch(error){
      console.log("Error on GetSignatureLikeList: ", error);
      throw error;
    }
  }

  async getMyRecentSignatures(userId: number, take:number) { // 가장 최신 시그니처 반환
    // 1. 메이트 탐색의 기준이 될 장소 가져오기 = 사용자의 가장 최신 시그니처의 첫 번째 페이지 장소
    return await SignatureEntity.find({
      where: {
        user:{ id: userId },
      },
      order: {
        created: 'DESC' // 'created'를 내림차순으로 정렬해서 가장 최근꺼 가져오기
      },
      take: take,          // 최신 시그니처 가져오기
    });
  }
}

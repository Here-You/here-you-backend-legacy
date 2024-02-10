//mate.service.ts

import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { S3UtilService } from '../utils/S3.service';
import { CursorPageOptionsDto } from './cursor-page/cursor-page-option.dto';
import { CursorPageDto } from './cursor-page/cursor-page.dto';
import { SignatureEntity } from '../signature/domain/signature.entity';
import { SignatureService } from '../signature/signature.service';
import { LessThan, Like, MoreThan, Not } from 'typeorm';
import { CursorPageMetaDto } from './cursor-page/cursor-page.meta.dto';
import { SignaturePageEntity } from '../signature/domain/signature.page.entity';
import { UserEntity } from '../user/user.entity';
import { MateRecommendProfileDto } from './dto/mate-recommend-profile.dto';
import { MateController } from './mate.controller';
import { MateSignatureCoverDto } from './dto/mate-signature-cover.dto';
import { MateWithCommonLocationResponseDto } from './dto/mate-with-common-location-response.dto';

@Injectable()
export class MateService{
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3UtilService,
    private readonly signatureService: SignatureService,
  ) {}

  async getMateProfileWithMyFirstLocation(userId: number): Promise<MateWithCommonLocationResponseDto> {
    try{

      const mateWithCommonLocationResponseDto = new MateWithCommonLocationResponseDto();

      // 1. 메이트 탐색의 기준이 될 장소 가져오기 = 사용자의 가장 최신 시그니처의 첫 번째 페이지 장소
      const mySignaturePageEntity = await SignaturePageEntity.findOne({
        where: {
          signature:{ user:{ id: userId } },
          page: 1
        },
        order: {
          created: 'DESC' // 'created'를 내림차순으로 정렬해서 가장 최근꺼 가져오기
        },
      });

      if(!mySignaturePageEntity){ // 로그인한 사용자가 아직 한번도 시그니처를 작성한 적이 없을 경우
        return null;
      }

      const longLocation = mySignaturePageEntity.location;
      console.log("*longLocation: ",longLocation);


      // 2. 쉼표로 구분된 현재 'longLocation'에서 핵심 부분인 마지막 부분을 가져오기
      const locationBlocks = longLocation.split(',');
      const myLocation = locationBlocks[locationBlocks.length-1].trim();
      console.log("*firstLocation: ", myLocation);

      const loginUser = await this.userService.findUserById(userId);
      mateWithCommonLocationResponseDto.location = myLocation;
      mateWithCommonLocationResponseDto.userName = loginUser.nickname;

      // 3. 이제 내 기준 로케이션이 사용된 모든 페이지 가져오기
      const commonLocationSignaturePages = await SignaturePageEntity.find({
        where: { location: Like(`%${myLocation}%`) },
        relations: ['signature']
      });

      // 4. 3번에서 찾아온 페이지의 시그니처 가져오기
      const commonLocationSignatures = [];
      for(const page of commonLocationSignaturePages){
        const signature = await SignatureEntity.findOne({
          where: { id: page.signature.id},
          relations: ['user'],
        });
        commonLocationSignatures.push(signature);
      }

      // 5. 시그니처 작성자 기준으로 분류: 중복된 작성자를 또 찾아오지 않기 위해
      const signatureGroups = {};
      for(const signature of commonLocationSignatures){
        if(!signatureGroups[signature.user.id]){  // 새로운 유저일 경우 새 리스트 생성, 시그니처 삽입
          signatureGroups[signature.user.id] = [];
          signatureGroups[signature.user.id].push(signature);
        }
      }


      // 6. 유저 아이디 순회하면서 한명씩 찾아서 메이트 프로필 생성하기
      const mateProfiles : MateRecommendProfileDto[] = [];

      for(const authorUserId of Object.keys(signatureGroups)){
        const authorId:number = Number(authorUserId);
        const mate = await this.userService.findUserById(authorId);

        if(userId == authorId) continue;  // 본인은 제외
        const locationSignature:SignatureEntity = signatureGroups[authorId][0];
        const mateProfile: MateRecommendProfileDto = await this.generateMateProfile(mate, userId, locationSignature);
        mateProfiles.push(mateProfile);

      }

      mateWithCommonLocationResponseDto.mateProfiles = mateProfiles;

      return mateWithCommonLocationResponseDto;

    }
    catch(error){
      console.log("Err: ", error);
      throw error;
    }
  }

  async recommendRandomMateWithInfiniteScroll(cursorPageOptionsDto: CursorPageOptionsDto, userId: number) {

    let cursorId: number = 0;

    // [0] 맨 처음 요청일 경우 랜덤 숫자 생성해서 cursorId에 할당
    if(cursorPageOptionsDto.cursorId == 0){
      const newUser = await UserEntity.find({
        order: {
          id: 'DESC' // id를 내림차순으로 정렬해서 가장 최근에 가입한 유저 가져오기
        },
        take: 1
      });
      const max = newUser[0].id + 1; // 랜덤 숫자 생성의 max 값
      console.log('max id: ',max);

      const min = 5;               // 랜덤 숫자 생성의 min 값
      // TODO 사용자 늘어나면 min 값 늘리기
      cursorId = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log('random cursor: ', cursorId);

    }
    else {
      cursorId = cursorPageOptionsDto.cursorId;
    }


    // [1] 무한 스크롤: take만큼 cursorId보다 id값이 작은 유저들 불러오기
    const [mates, total] = await UserEntity.findAndCount({
      take: cursorPageOptionsDto.take,
      where: cursorId ? {
        id: LessThan(cursorId)
      }: null,
      order: {
        id: "DESC" as any,
      },
    });

    console.log("mates: ", mates);

    // [2] 가져온 메이트들 프로필 커버 만들기
    const mateProfiles:MateRecommendProfileDto[] = [];

    for(const mate of mates){
      if(userId == mate.id) continue;  // 본인은 제외
      const mateProfile = await this.generateMateProfile(mate, userId, null);
      mateProfiles.push(mateProfile);
    }

    // [3] 스크롤 설정
    let hasNextData = true;
    let cursor: number;

    const takePerScroll = cursorPageOptionsDto.take;
    const isLastScroll = total <= takePerScroll;
    const lastDataPerScroll = mates[mates.length - 1];

    if (isLastScroll) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = lastDataPerScroll.id;
    }

    const cursorPageMetaDto = new CursorPageMetaDto(
      { cursorPageOptionsDto, total, hasNextData, cursor });

    return new CursorPageDto(mateProfiles, cursorPageMetaDto);

  }

  async generateMateProfile(mate:UserEntity, userId:number, locationSignature:SignatureEntity){
    const mateProfile = new MateRecommendProfileDto();

    // 1. 메이트의 기본 정보 담기
    mateProfile._id = mate.id;
    mateProfile.mateName = mate.nickname;
    mateProfile.introduction = mate.introduction;

    // 2. 로그인한 유저가 메이트를 팔로우하는지 팔로우 여부 체크
    const myEntity = await this.userService.findUserById(userId);
    mateProfile.is_followed = await this.userService.checkIfFollowing(myEntity, mate.id);

    // 3. 메이트 프로필 사진 가져오기
    let userProfileImage = await this.userService.getProfileImage(mate.id);
    if(!userProfileImage) mateProfile.mateImage = null;
    else{
      let userImageKey = userProfileImage.imageKey;
      mateProfile.mateImage = await this.s3Service.getImageUrl(userImageKey);
    }

    /****************************************************
                4. 메이트 대표 시그니처 두 개 구하기
           [1] 랜덤 메이트 추천: 가장 최신 시그니처 두 개
     [2] 장소 기반 추천: 장소 관련 시그니처 1개, 최신 시그니처 1개
     ****************************************************/
    console.log("locationSig: ", locationSignature);

    let recommendSignatures = [];

    if(locationSignature == null){ // [1] 랜덤 추천이면 가장 최신 시그니처 두 개 가져오기
      recommendSignatures = await this.signatureService.getMyRecentSignatures(mate.id, 2);
    }
    else{ // [2] 장소 기반 추천이면 장소 관련 하나, 최신 시그니처 하나
      recommendSignatures.push(locationSignature);
      console.log("recommendSignatures: ",recommendSignatures);

      // ㄱ. 삽입할 최신 시그니처 후보 두 개 가져오기 (두 개 중에 이미 삽입된 시그니처와 다른 것을 추가할 것임)
      const recentSignatures = await this.signatureService.getMyRecentSignatures(mate.id, 2);

      // ㄴ. 이미 들어있는 시그니처와 id 비교해서 다르면 삽입
      for(const recentSignature of recentSignatures){
        console.log("recentSignature.id: ",recentSignature.id);
        console.log("locationSignature.id: ",locationSignature.id);

        if(recentSignature.id != locationSignature.id) { // 이미 들어있는 시그니처와 다른 경우에만 push
          console.log("push! : ", recentSignature.id)
          recommendSignatures.push(recentSignature);
          break;
        }
      }
    }

    const signatureCovers = [];
    //TODO 작성자가 작성한 시그니처가 하나일 경우에는 리스트에 하나만 담겨있음 프론트에 알리기 -> 완료
    for(const signature of recommendSignatures) {
      const signatureCover: MateSignatureCoverDto = new MateSignatureCoverDto();

      console.log("signature.id: ",signature.id);
      signatureCover._id = signature.id;
      signatureCover.title = signature.title;
      let thumbnailImageKey = await SignaturePageEntity.findThumbnail(signature.id);
      signatureCover.image = await this.s3Service.getImageUrl(thumbnailImageKey);

      console.log("signatureCover: ", signatureCover);
      signatureCovers.push(signatureCover);
    }
    mateProfile.signatures = signatureCovers;
    return mateProfile;

  }

}
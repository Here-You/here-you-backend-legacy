// search.service.ts

import { Injectable } from '@nestjs/common';
import { SignatureEntity } from '../signature/domain/signature.entity';
import { CoverSignatureDto } from './dto/cover-signature.dto';
import { SignaturePageEntity } from '../signature/domain/signature.page.entity';
import { UserService } from '../user/user.service';
import { exit } from '@nestjs/cli/actions';
import { SignatureService } from '../signature/signature.service';

@Injectable()
export class SearchService{

  constructor(
    private readonly userService: UserService,
    private readonly signatureService: SignatureService
  ) {}

  async findHotSignatures(): Promise<CoverSignatureDto[]> {
    try{
      /*****************************************
       인기 시그니처 알고리즘 로직:
       [1] 최근 일주일 안에 올라온 시그니처 모두 가져오기
       [2] 그 중에서 좋아요 개수 상위 20개 리턴
       *****************************************/

        // [1] 최근 일주일 안에 올라온 시그니처 가져오기
      const recentSignatures: SignatureEntity[] = await SignatureEntity.findRecentSignatures();

      // [2] 최근 시그니처들 리스트 좋아요 순으로 정렬
      recentSignatures.sort((a,b) => a.liked - b.liked );
      console.log(recentSignatures);

      // [3] 그 중에서 20개만 리턴한다
      const hotSignatureCovers: CoverSignatureDto[] = await this.getSignatureCovers(recentSignatures);

      return hotSignatureCovers;

    }catch(error){
      console.log("Error on findHotSignatures: ", error);
      throw error;
    }

  }

  async findMatesNewSignatures(userId: number) {
    try{
      /********************************************************
       내 메이트 최신 시그니처 로직:
        [1] 내가 팔로우하고 있는 메이트 목록 가져오기
        [2] 각 메이트가 작성한 시그니처 중 일주일 안으로 작성된 것만 가져오기
        [3] 최신순으로 정렬해서 20개만 리턴
      ********************************************************/

      // [1] 내가 팔로우하고 있는 메이트 목록 가져오기
      const followingMates = await this.userService.findFollowingMates(userId);

      // [2] 각 메이트들이 작성한 시그니처 목록에 담기
      const totalNewSignatures: SignatureEntity[] = [];
      for(const mate of followingMates){
        const mateNewSignatures:SignatureEntity[] = await SignatureEntity.findNewSignaturesByUser(mate.id);

        for(const newSignature of mateNewSignatures){
          totalNewSignatures.push(newSignature);
        }
      }

      // [3] 최신 순으로 정렬
      totalNewSignatures.sort((a,b)=>a.created.getDate()-b.created.getDate());

      // [4] 20개만 리턴
      const newSignatureCovers: CoverSignatureDto[] = await this.getSignatureCovers(totalNewSignatures);

      return newSignatureCovers;

      }catch (error){
      console.log("Error on FindMatesNewSigs: "+error);
      throw error;
    }
  }

  async getSignatureCovers(signatureEntities){

    const signatureCovers: CoverSignatureDto[] = [];

    for (let i = 0; i < signatureEntities.length && i < 20; i++) {
      const signature = signatureEntities[i];
      const signatureCoverDto = new CoverSignatureDto();

      signatureCoverDto._id = signature.id;
      signatureCoverDto.title = signature.title;
      signatureCoverDto.liked = signature.liked;
      signatureCoverDto.userName = signature.user.name;

      signatureCoverDto.date = await SignatureEntity.formatDateString(signature.created);
      signatureCoverDto.image = await SignaturePageEntity.findThumbnail(signature.id);

      const userProfileImageEntity = await this.userService.getProfileImage(signature.user.id);
      signatureCoverDto.userImage = userProfileImageEntity.imageKey;

      signatureCovers.push(signatureCoverDto);
    }

    return signatureCovers;
  }
}
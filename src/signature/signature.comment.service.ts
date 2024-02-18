// signature.comment.service.ts

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { S3UtilService } from '../utils/S3.service';
import { SignatureService } from './signature.service';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { SignatureCommentEntity } from './domain/signature.comment.entity';
import { UserEntity } from '../user/user.entity';
import { SignatureEntity } from './domain/signature.entity';
import { CursorPageOptionsDto } from '../rule/dto/cursor-page.options.dto';
import { CommentEntity } from '../comment/domain/comment.entity';
import { MoreThan } from 'typeorm';
import { GetCommentDto } from '../rule/dto/get-comment.dto';
import { GetSignatureCommentDto } from './dto/comment/get-signature-comment.dto';
import { GetCommentWriterDto } from './dto/comment/get-comment-writer.dto';
import * as querystring from 'querystring';
import { CursorPageMetaDto } from '../mate/cursor-page/cursor-page.meta.dto';
import { CursorPageDto } from '../mate/cursor-page/cursor-page.dto';
import { NotificationEntity } from '../notification/notification.entity';

@Injectable()
export class SignatureCommentService{

  constructor(
    private readonly signatureService: SignatureService,
    private readonly userService: UserService,
    private readonly s3Service: S3UtilService,
  ) {}

  async createSignatureComment( // 댓글, 답글 생성하기
    createCommentDto: CreateCommentDto,
    userId: number,
    signatureId: number,
    parentCommentId?: number){

    const comment = new SignatureCommentEntity();

    const user = await UserEntity.findOneOrFail({ where: { id: userId }});
    const signature = await SignatureEntity.findOneOrFail( { where: { id: signatureId }});


    if( !user || !signature ) {
      throw new NotFoundException('404 Not Found');
    }
    else {

      comment.user = user;
      comment.signature = signature;
      comment.content = createCommentDto.content;

      // 알림 생성
      const notification = new NotificationEntity();

      // parentCommentId가 존재할 경우 -> 답글 / 존재하지 않을 경우 -> 댓글
      if(parentCommentId){  // 대댓글: parentId는 파라미터로 받은 parentCommentId로 설정

        const parentComment = await SignatureCommentEntity.findOneOrFail( {
          where:{ id: parentCommentId
          }});

        if( !parentComment ) throw new NotFoundException('404 Not Found');
        else {
          comment.parentComment = parentComment;
          await comment.save();
        }

        notification.notificationReceiver = parentComment.user;
      }
      else{  // 댓글: parentId는 본인으로 설정
        const savedComment = await comment.save();
        savedComment.parentComment = savedComment;
        await savedComment.save();

        notification.notificationReceiver = signature.user;
      }

      notification.notificationSender = user;
      notification.notificationTargetType = 'SIGNATURE';
      notification.notificationTargetId = signature.id;
      notification.notificationAction = 'COMMENT';
      await notification.save();

      return comment.id;
    }
  }

  async getSignatureComment(  // 댓글 가져오기
    cursorPageOptionsDto: CursorPageOptionsDto,
    userId: number,
    signatureId: number,
  ) {

    // 1. 'cursorId'부터 오름차순 정령된 댓글 'take'만큼 가져오기
    const [comments, total] = await SignatureCommentEntity.findAndCount({
      take: cursorPageOptionsDto.take,
      where: {
        signature: { id: signatureId },
        parentComment: { id: cursorPageOptionsDto.cursorId ? MoreThan(cursorPageOptionsDto.cursorId) : null },
      },
      relations: {
        user: { profileImage: true },
        parentComment: true,
        signature:{
          user: true,
        }
      },
      order: {
        parentComment: { id: "ASC" as any,},
      },
    });

    // 2. 댓글 response dto에 담기
    const result = await Promise.all(comments.map(async (comment) => {
      const writerProfile = new GetCommentWriterDto();
      const getCommentDto = new GetSignatureCommentDto();

      // 2-[1] 댓글 작성자 정보 담기
      writerProfile._id = comment.user.id;
      writerProfile.name = comment.user.nickname;

      // 로그인한 사용자가 댓글 작성자(혹은 시그니처 작성자-> 보류)인지 확인
      //if( userId == comment.user.id || userId == comment.signature.user.id ) writerProfile.is_writer = true;
      if( userId == comment.user.id ) writerProfile.is_writer = true;

      else writerProfile.is_writer = false;

      // 작성자 프로필 이미지
      const image = comment.user.profileImage;
      if(image == null) writerProfile.image = null;
      else {
        const userImageKey = image.imageKey;
        writerProfile.image = await this.s3Service.getImageUrl(userImageKey);
      }

      // 2-[2] 댓글 정보 담기
      getCommentDto._id = comment.id;
      getCommentDto.content = comment.content;
      getCommentDto.parentId = comment.parentComment.id;
      getCommentDto.writer = writerProfile;
      getCommentDto.date = comment.updated;

      // 댓글 수정 여부 구하기
      const createdTime = comment.created.getTime();
      const updatedTime = comment.updated.getTime();

      if (Math.abs(createdTime - updatedTime) <= 2000) {  // 두 시간 차가 2초 이하면 수정 안함
        getCommentDto.is_edited = false;
      } else {
        getCommentDto.is_edited = true;
      }

      // 로그인한 사용자가 시그니처 작성하면 can_delete = true
      let can_delete = false;
      if(comment.signature.user){ // 시그니처 작성자가 존재할 경우
        if(comment.signature.user.id == userId){  // 로그인한 사용자가 시그니처 작성자일 경우 댓글 삭제 가능
          can_delete = true;
        }
      }
      getCommentDto.can_delete = can_delete;

      return getCommentDto;

    }));

    // 3. 스크롤 설정
    let hasNextData = true;
    let cursor: number;

    const takePerScroll = cursorPageOptionsDto.take;
    const isLastScroll = total <= takePerScroll;
    const lastDataPerScroll = comments[comments.length - 1];

    if (isLastScroll) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = lastDataPerScroll.id;
    }

    const cursorPageMetaDto = new CursorPageMetaDto(
      { cursorPageOptionsDto, total, hasNextData, cursor });

    return new CursorPageDto( result, cursorPageMetaDto );


  }

  async patchSignatureComment(  // 댓글 수정하기
    userId: number,
    signatureId: number,
    commentId: number,
    patchedComment: CreateCommentDto) {

    // 시그니처 유효한지 확인
    const signature = await SignatureEntity.findOne({
      where:{ id: signatureId },
      relations: { user: true }
    });
    if(!signature) throw new NotFoundException('존재하지 않는 시그니처입니다');

    // 댓글 데이터 유효한지 확인
    const comment = await SignatureCommentEntity.findOne({
        where:{ id: commentId },
        relations: { user: true }
      },
    );
    if(!comment) throw new NotFoundException('존재하지 않는 댓글입니다');


    let forbiddenUser = true;
    // 댓글 작성자가 로그인한 사용자 본인 혹은 시그니처 작성자가 맞는지 확인
    if(signature.user){ // 시그니처 작성자가 존재한다면 시그니처 작성자와 로그인한 사용자가 일치하는지 확인
      if( signature.user.id == userId ) forbiddenUser = false;
    }

    if(comment.user.id){ // 댓글 작성자가 존재한다면 댓글 작성자와 로그인한 사용자가 일치하는지 확인
      if(comment.user.id == userId ) forbiddenUser = false;
    }

    if(forbiddenUser) throw new ForbiddenException('댓글 수정 권한이 없습니다');


    // 댓글 수정하기
    comment.content = patchedComment.content;
    await comment.save();
    return comment.id;

  }

  async deleteSignatureComment(userId: number, signatureId: number, commentId: number) {
    try {
      // 시그니처 유효한지 확인
      const signature = await SignatureEntity.findOne({
        where: { id: signatureId },
        relations: { user: true }
      });
      if (!signature) throw new NotFoundException('존재하지 않는 시그니처입니다');

      // 댓글 데이터 유효한지 확인
      const comment = await SignatureCommentEntity.findOne({
          where: { id: commentId },
          relations: ['user', 'parentComment', 'signature']
        },
      );
      if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다');


      let forbiddenUser = true;
      // 댓글 작성자가 로그인한 사용자 본인 혹은 시그니처 작성자가 맞는지 확인
      if(signature.user){ // 시그니처 작성자가 존재한다면 시그니처 작성자와 로그인한 사용자가 일치하는지 확인
        if( signature.user.id == userId ) forbiddenUser = false;
      }

      if(comment.user.id){ // 댓글 작성자가 존재한다면 댓글 작성자와 로그인한 사용자가 일치하는지 확인
        if(comment.user.id == userId ) forbiddenUser = false;
      }

      if(forbiddenUser) throw new ForbiddenException('댓글 삭제 권한이 없습니다');


      // 해당 댓글이 부모 댓글인 경우 자식 댓글 모두 삭제
      if (commentId == comment.parentComment.id) {

        // 자식 댓글 모두 찾아오기
        const replyComments: SignatureCommentEntity[] = await SignatureCommentEntity.find({
          where: { parentComment: { id: commentId } }
        });

        // 자식 댓글 모두 삭제
        for (const reply of replyComments) {
          await reply.softRemove();
        }

        // 자식 모두 삭제했으면 부모 댓글 삭제
        await comment.softRemove();

      }
      else{ // 자식 댓글 없는 경우 본인만 삭제
        await comment.softRemove();
      }

      return commentId;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
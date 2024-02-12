import {Injectable, HttpException, BadRequestException, HttpStatus} from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { UserEntity} from "../user/user.entity";
import {DetailMemberDto, DetailRuleDto, RulePairDto} from "./dto/detail.rule.dto";
import { S3UtilService} from "../utils/S3.service";
import { GetMemberListDto} from "./dto/get-member-list.dto";
import {UserService} from "../user/user.service";
import {GetRuleListDto, MemberPairDto} from "./dto/get-rule-list.dto";
import { Equal, LessThan, Like, MoreThan, Not } from 'typeorm';
import {GetSearchMemberDto} from "./dto/get-search-member.dto";
import {UpdateRuleDto} from "./dto/update-rule.dto";
import {CursorPageOptionsDto} from "../mate/cursor-page/cursor-page-option.dto";
import {CommentEntity} from "../comment/domain/comment.entity";
import {GetCommentDto } from "./dto/get-comment.dto";
import {CursorPageDto} from "./dto/cursor-page.dto";
import {CursorPageMetaDto} from "./dto/cursor-page.meta.dto";
import {GetSearchMemberAtCreateDto} from "./dto/get-search-member-at-create.dto";

@Injectable()
export class RuleService {
  constructor(
      private readonly s3Service: S3UtilService,
      private readonly userService: UserService,
  ) {}

  // [1] 여행 규칙 생성
  async createRule(dto: CreateRuleDto, userId: number): Promise<number> {
    // -1) main 저장
    const main = new RuleMainEntity();
    main.mainTitle = dto.mainTitle;
    await main.save();
    console.log(main);

    // -2) rule 저장
    const subs = await Promise.all(dto.rulePairs.map(async (pair) => {
      const sub = new RuleSubEntity();
      sub.ruleTitle = pair.ruleTitle;
      sub.ruleDetail = pair.ruleDetail;
      sub.main = main;

      await sub.save();
      return sub;
    }));
    console.log(subs);


    // -3) invitation 저장
    const members = await Promise.all(dto.membersId.map(async (memberId) : Promise<RuleInvitationEntity> => {
      const ruleInvitationEntity = new RuleInvitationEntity();

      const userEntity = await UserEntity.findOneOrFail({ where: { id: memberId } });
      ruleInvitationEntity.rule = main;
      ruleInvitationEntity.member = userEntity;

      await ruleInvitationEntity.save();
      return ruleInvitationEntity;
    }));

    // -4) 여행 규칙 글 작성자 정보 저장
    const writerEntity = new RuleInvitationEntity();

    const inviterEntity = await UserEntity.findOneOrFail({ where: { id: userId } });
    writerEntity.member = inviterEntity;
    writerEntity.rule = main;
    await writerEntity.save();

    return main.id;
  }

  // [2] 여행 규칙 상세 페이지 조회 (게시글)
  async getDetail(userId: number, ruleId : number): Promise<DetailRuleDto> {
    const dto = new DetailRuleDto();
    const main: RuleMainEntity = await RuleMainEntity.findRuleById(ruleId);
    const subs: RuleSubEntity[] = await RuleSubEntity.findSubById(ruleId);
    const invitations: RuleInvitationEntity[] = await RuleInvitationEntity.find({
      where: {rule: {id: ruleId}},
      relations: {member: {profileImage : true}}
    })

    try {
      // 요청을 보낸 현재 로그인 사용자가 해당 규칙의 멤버인지 검증 (권한)
      const user = await UserEntity.findExistUser(userId);
      let checkValidation = false;
      for(const invitation of invitations) {
        if(invitation.member.id == user.id) {
          checkValidation = true;
          break;
        }
      }
      if(!checkValidation) {
        throw new BadRequestException('해당 여행 규칙의 멤버가 아닙니다');
      }

      // -1) 제목
      dto.id = ruleId;
      dto.mainTitle = main.mainTitle;

      // -2) 규칙
      dto.rulePairs = await Promise.all(subs.map(async(sub):Promise<RulePairDto> => {
        const rulePair = new RulePairDto();
        rulePair.id = sub.id;
        rulePair.ruleTitle = sub.ruleTitle;
        rulePair.ruleDetail = sub.ruleDetail;

        return rulePair;
      }));

      // -3) 멤버 정보
      dto.detailMembers = await Promise.all(invitations.map(async(invitation):Promise<DetailMemberDto> => {
        const detailMember = new DetailMemberDto;
        const memberEntity = invitation.member;
        detailMember.id = memberEntity.id;
        detailMember.name = memberEntity.name;

        // 사용자 프로필 이미지
        const image = memberEntity.profileImage;
        if(image == null) detailMember.image = null;
        else{
          const userImageKey = image.imageKey;
          detailMember.image = await this.s3Service.getImageUrl(userImageKey);
        }
        return detailMember;
      }))
      return dto;
    } catch (e) {
      console.log('게시글 조회에 실패하였습니다');
      throw new Error(e.message);
    }
  };

  // [3] 여행 규칙 상세 페이지 조회 (댓글) - 페이지네이션
  async getComment(cursorPageOptionsDto: CursorPageOptionsDto, ruleId: number): Promise<CursorPageDto<GetCommentDto>> {

    const cursorId: number = cursorPageOptionsDto.cursorId;

    // (1) 데이터 조회
    const [comments, total] = await CommentEntity.findAndCount({
      take: cursorPageOptionsDto.take,
      where: {
        rule: { id: ruleId },
        id: cursorId ? MoreThan(cursorId) : null,
      },
      relations: {user:{profileImage: true}},
      order: {
        id: "ASC" as any,
      },
    });

    const result = await Promise.all(comments.map(async (comment) => {
      const getCommentDto = new GetCommentDto();

      getCommentDto.id = comment.id;
      getCommentDto.writerId = comment.user.id;
      getCommentDto.name = comment.user.name;
      getCommentDto.content = comment.content;
      getCommentDto.updated = comment.updated;

      // 사용자 프로필 이미지
      const image = comment.user.profileImage;
      if(image == null) getCommentDto.image = null;
      else {
        const userImageKey = image.imageKey;
        getCommentDto.image = await this.s3Service.getImageUrl(userImageKey);
      }

      return getCommentDto;
    }));

    // (2) 페이징 및 정렬 기준 설정
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

    const cursorPageMetaDto = new CursorPageMetaDto({ cursorPageOptionsDto, total, hasNextData, cursor });

    return new CursorPageDto(result, cursorPageMetaDto);
  }

  // [4] 여행 규칙 나가기
  // -1) 초대 받은 팀원 -> 초대 삭제
  async deleteInvitation(ruleId: number, userId: number): Promise<RuleInvitationEntity> {
    try {
      // 검증1) 사용자가 존재하지 않는 경우
      const user = await UserEntity.findOne({
        where: {id : userId},
      });
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      // 검증2) 규칙이 존재하지 않는 경우
      const ruleMain = await RuleMainEntity.findOne({
        where : {id : ruleId},
      });
      if (!ruleMain) throw new Error('규칙을 찾을 수 없습니다');

      // 검증3) 규칙에 참여하는 사용자가 아닌 경우
      const invitation = await RuleInvitationEntity.findOne({
        where: {member: {id: userId}, rule: {id: ruleId}},
      })
      if (!!invitation) {
        return invitation.softRemove();
      } else throw new Error('사용자가 참여하는 규칙이 아닙니다');
    } catch (e) {
      console.log('여행 규칙 나가기 실패');
      throw new Error(e.message);
    }
  }

  // [4] 여행 규칙 멤버 리스트 조회
  async getMemberList(ruleId: number): Promise<GetMemberListDto[]> {
    const invitationsList : RuleInvitationEntity[] = await RuleInvitationEntity.find({
      where : {rule : {id: ruleId}},
      relations : {member : true}
    });

    const membersList : GetMemberListDto[] = await Promise.all(invitationsList.map(async (invitation) : Promise<GetMemberListDto> => {
      const memberEntity : UserEntity = invitation.member;
      const memberDto : GetMemberListDto = new GetMemberListDto();

      console.log('memberEntity : ', memberEntity);
      memberDto.id = memberEntity.id;
      memberDto.name = memberEntity.name;
      memberDto.email = memberEntity.email;
      memberDto.introduction = memberEntity.introduction;

      // 사용자 프로필 이미지
      const image = await this.userService.getProfileImage(memberEntity.id);
      if(image == null) memberDto.image = null;
      else {
        const userImageKey = image.imageKey;
        memberDto.image = await this.s3Service.getImageUrl(userImageKey);
      }
      return memberDto;
    }));
    const sortedList = membersList.sort((a, b) => a.id - b.id);
    return sortedList;
  }

  // [5] 여행 규칙 전체 리스트 조회
  async getRuleList(userId: number) :Promise<GetRuleListDto[]> {
    const userEntity = await UserEntity.findOne({
      where: {
        id: userId,
      },
      relations: {
        ruleParticipate: {
          rule: {
            invitations: {
              member: {
                profileImage: true,
              },
            },
          },
        },
      },
    });

    try {
      const invitationEntities = userEntity.ruleParticipate;

      if (!!invitationEntities) {
        const ruleMains = await Promise.all(invitationEntities.map(async (invitation : RuleInvitationEntity) : Promise<GetRuleListDto> => {
          console.log(invitation);
          const ruleMain : RuleMainEntity = invitation.rule as RuleMainEntity;
          const ruleListDto : GetRuleListDto = new GetRuleListDto;

          console.log('ruleMain.id : ', ruleMain.id);

          ruleListDto.id = ruleMain.id;
          ruleListDto.title = ruleMain.mainTitle;
          ruleListDto.updated = ruleMain.updated;
          ruleListDto.memberCnt = ruleMain.invitations.length;
          ruleListDto.memberPairs = await this.getMemberPairs(ruleMain);

          return ruleListDto;
        }));
        return ruleMains;
      }
    } catch (e) {
      console.error(e);
      console.log('참여하는 여행 규칙이 없습니다');
    }
  }

  async getMemberPairs(ruleMain: RuleMainEntity) : Promise<MemberPairDto[]> {
    const invitations: RuleInvitationEntity[] = ruleMain.invitations;

    const result : MemberPairDto[] = await Promise.all(invitations.map(async (invitation) : Promise<MemberPairDto> => {
      const memberPair = new MemberPairDto;
      const user: UserEntity = invitation.member;

      console.log('user.id : ', user.id);
      memberPair.id = user.id;
      memberPair.name = user.name;

      // 사용자 프로필 이미지
      const image = user.profileImage;
      if(image == null) memberPair.image = null;
      else {
        const userImageKey = image.imageKey;
        memberPair.image = await this.s3Service.getImageUrl(userImageKey);
      }
    return memberPair;
  }));
    return result;
  }

  // [6] 여행 규칙 참여 멤버로 초대할 메이트 검색 결과
  // 여행 규칙 생성 / 여행 규칙 수정 분리
  // case1. 여행 규칙 생성
  async getSearchMemberAtCreate(cursorPageOptionsDto: CursorPageOptionsDto, userId: number, searchTerm: string): Promise<CursorPageDto<GetSearchMemberAtCreateDto>> {
    let cursorId: number = 0;

    console.log('cursorId : ', cursorPageOptionsDto);
    // (1) 처음 요청인 경우 cursorId 설정
    if(cursorPageOptionsDto.cursorId == 0){
      const newUser = await UserEntity.find({
        order: {
          id: 'DESC'  // 가장 최근에 가입한 유저
        },
        take: 1
      });
      const cursorId = newUser[0].id + 1;

      console.log('cursorPageOptionsDto.cursorId == 0 로 인식');
      console.log('cursor: ', cursorId);
    }
    else {
      cursorId = cursorPageOptionsDto.cursorId;
      console.log('cursorPageOptionsDto.cursorId != 0 로 인식')
    }
    console.log('cursor: ', cursorId);

    // (2) 데이터 조회
    // 검색 결과에 해당하는 값 찾기
    // 해당 결과값을 name 혹은 nickName 에 포함하고 있는 사용자 찾기
    // { id: Not(Equal(userId))}  // 사용자 본인은 검색결과에 뜨지 않도록
    console.log('검색 값: ', searchTerm);
    const [resultUsers, total] = await UserEntity.findAndCount({
      take: cursorPageOptionsDto.take,
      where: [
        { id: cursorId ? LessThan(cursorId) : null, name: Like(`%${searchTerm}%`) },
        { id: cursorId ? LessThan(cursorId) : null, nickname: Like(`%${searchTerm}%`)},
      ],
      relations: {profileImage : true, ruleParticipate: {rule: true}},
      order: {
        id: "DESC" as any,
      },
    });

    const searchResult = await Promise.all(resultUsers.map(async (user) => {
      const dtoAtCreate: GetSearchMemberAtCreateDto = new GetSearchMemberAtCreateDto();

      dtoAtCreate.id = user.id;
      dtoAtCreate.name = user.name;
      dtoAtCreate.email = user.email;
      dtoAtCreate.introduction = user.introduction;

      // 사용자 프로필 이미지
      const image = user.profileImage;
      if(image == null) dtoAtCreate.image = null;
      else{
        const userImageKey = image.imageKey;
        dtoAtCreate.image = await this.s3Service.getImageUrl(userImageKey);
      }
      return dtoAtCreate;
    }));

    console.log('searchResult : ',searchResult);

    // (3) 페이징 및 정렬 기준 설정
    let hasNextData = true;
    let cursor: number;

    const takePerScroll = cursorPageOptionsDto.take;
    console.log('takePerScroll : ',takePerScroll);
    const isLastScroll = total <= takePerScroll;
    console.log('isLastScroll : ', isLastScroll);
    console.log('total : ', total)
    const lastDataPerScroll = resultUsers[resultUsers.length - 1];

    if (isLastScroll) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = lastDataPerScroll.id;
    }

    const cursorPageMetaDto = new CursorPageMetaDto({ cursorPageOptionsDto, total, hasNextData, cursor });

    return new CursorPageDto(searchResult, cursorPageMetaDto);
  }

  // [6-2] case2. 여행 규칙 수정
  async getSearchMemberAtUpdate(cursorPageOptionsDto: CursorPageOptionsDto, userId: number, ruleId: number, searchTerm: string): Promise<CursorPageDto<GetSearchMemberDto>> {
    let cursorId: number = 0;

    // (1) 처음 요청인 경우 cursorId 설정
    if(cursorPageOptionsDto.cursorId == 0){
      const newUser = await UserEntity.find({
        order: {
          id: 'DESC'  // 가장 최근에 가입한 유저
        },
        take: 1
      });
      const cursorId = newUser[0].id + 1;

      console.log('cursor: ', cursorId);
    }
    else {
      cursorId = cursorPageOptionsDto.cursorId;
    }

    // (2) 데이터 조회
    // 검색 결과에 해당하는 값 찾기
    // 해당 결과값을 name 혹은 nickName 에 포함하고 있는 사용자 찾기
    console.log('검색 값: ', searchTerm);
    const [resultUsers, total] = await UserEntity.findAndCount({
      take: cursorPageOptionsDto.take,
      where: [
        { id: cursorId ? LessThan(cursorId) : null, name: Like(`%${searchTerm}%`) },
        { id: cursorId ? LessThan(cursorId) : null, nickname: Like(`%${searchTerm}%`)},
      ],
      relations: {profileImage : true, ruleParticipate: {rule: true}},
      order: {
        id: "DESC" as any,
      },
    });

    const searchResult = await Promise.all(resultUsers.map(async (user) => {
      const dto: GetSearchMemberDto = new GetSearchMemberDto();

      dto.id = user.id;
      dto.name = user.name;
      dto.email = user.email;
      dto.introduction = user.introduction;

      // 이미 여행 규칙에 참여하는 멤버인지 여부
      dto.isInvited = await this.userService.checkAlreadyMember(user.id, ruleId);

      // 사용자 프로필 이미지
      const image = user.profileImage;
      if(image == null) dto.image = null;
      else{
        const userImageKey = image.imageKey;
        dto.image = await this.s3Service.getImageUrl(userImageKey);
      }
      return dto;
    }));

    console.log('searchResult : ',searchResult);

    // (3) 페이징 및 정렬 기준 설정
    let hasNextData = true;
    let cursor: number;

    const takePerScroll = cursorPageOptionsDto.take;
    const isLastScroll = total <= takePerScroll;
    const lastDataPerScroll = searchResult[searchResult.length - 1];

    if (isLastScroll) {
      hasNextData = false;
      cursor = null;
    } else {
      cursor = lastDataPerScroll.id;
    }

    const cursorPageMetaDto = new CursorPageMetaDto({ cursorPageOptionsDto, total, hasNextData, cursor });

    return new CursorPageDto(searchResult, cursorPageMetaDto);
  }

  // [7] 여행 규칙 수정
  async updateRule(updateRuleDto: UpdateRuleDto, userId: number, ruleId: number): Promise<number> {
    const rule = await RuleMainEntity.findOne({
      where: {id : ruleId },
      relations: { rules: true, invitations: {member : true} }
    })

    rule.mainTitle = updateRuleDto.mainTitle
    await rule.save();

    // (1) [상세 규칙 수정]
    // 기존 세부 규칙 정보 리스트
    const subs = rule.rules;

    // 새로운 세부 규칙 리스트
    const updateSubsList = updateRuleDto.rulePairs;

    // case1) 규칙 삭제
    for(const sub of subs) {
      let isDeleteSub : boolean = true;
      for(const updateSub of updateSubsList) {
        if(sub.id == updateSub.id) {
          isDeleteSub = false;
          break;
        }
      }
      if (isDeleteSub) {
        await sub.softRemove();
        console.log('삭제하는 sub 규칙 : ', sub.id);
      }
    }

    // case2) 규칙 수정 및 규칙 추가
    for (const updateSub of updateSubsList) {
      // case1) 새로운 규칙
      if (!updateSub.id) {
        const newSub = new RuleSubEntity()
        newSub.main = rule;
        newSub.ruleTitle = updateSub.ruleTitle;
        newSub.ruleDetail = updateSub.ruleDetail;

        await newSub.save();
        console.log('새로 저장하는 sub 규칙 : ', newSub.id);
      }
      // case2) 수정 규칙
      else {
        const oldSub = await RuleSubEntity.findOne({
          where: {id: updateSub.id}
        })
        oldSub.ruleTitle = updateSub.ruleTitle;
        oldSub.ruleDetail = updateSub.ruleDetail;

        await oldSub.save();
        console.log('수정하는 규칙 ID : ', oldSub);
      }
    }

    // (2) [여행 규칙 멤버 수정]
    // 기존 멤버 초대 리스트
    const oldInvitations = await RuleInvitationEntity.find({
      where: {rule: {id : ruleId}},
      relations: {member: true}
    })
    // 수정된 멤버 ID 리스트
    const updateMemberIds = updateRuleDto.membersId;

    // case1) 멤버 삭제
    for(const invitation of oldInvitations) {
      const member = invitation.member;
      let isDeleteMember : boolean = true;

      // (예외 상황) 현재 로그인한 사용자
      if (member.id == userId) break;

      for(const updateMemberId of updateMemberIds) {
        if(member.id == updateMemberId) {
          isDeleteMember = false;
          break;
        }
      }
      if(isDeleteMember) {
        await invitation.softRemove();
        console.log('삭제하는 멤버 ID : ', invitation.id);
      }
    }

    // case2) 멤버 추가
    for (const updateMemberId of updateMemberIds) {
      const member = await UserEntity.findExistUser(updateMemberId);

      let isPostMember : boolean = true;

      for(const oldInvitation of oldInvitations) {
        const oldMember = oldInvitation.member;
        if(oldMember.id == updateMemberId) {
          isPostMember = false;
          break;
        }
      }

      if(isPostMember) {
        const newInvitation = new RuleInvitationEntity();

        newInvitation.member = await UserEntity.findExistUser(updateMemberId);
        newInvitation.rule = rule;

        await newInvitation.save();
        console.log('새로 초대한 멤버 ID : ', updateMemberId);
      }
    }

    console.log('--여행 규칙 수정이 완료되었습니다--')
    return rule.id;
  }


  // [member] 초대 받은 멤버 리스트 생성
  async getInvitationList(ruleId: number) {
    try {
      const invitationEntity = await RuleInvitationEntity.find({
        where: { id : ruleId },
        relations: ['invited'],
      });
      return invitationEntity;
    } catch (error) {
      console.log('Error on getInvitationList: ' + error);
    }
  }
}

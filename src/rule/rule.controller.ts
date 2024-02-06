import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { ResponseCode } from '../response/response-code.enum';
import { ResponseDto } from '../response/response.dto';
import { MetaToBackDto } from './dto/meta-to-back.dto';
// import { EditRuleDto} from "./dto/edit-rule.dto";

@Controller('mate/rule')
export class RuleController {
  constructor(
    private readonly ruleService: RuleService,
  ) {}

  // 여행 규칙 생성
  @Post('/write')
  async createRule(@Body() createRuleDto: CreateRuleDto): Promise<ResponseDto<any>> {
    const result = await this.ruleService.createRule(createRuleDto);

    if(!result){
      return new ResponseDto(
        ResponseCode.RULE_CREATION_FAIL,
        false,
        "여행 규칙 생성 실패",
        null);

    }
    else{
      return new ResponseDto(
        ResponseCode.RULE_CREATED,
        true,
        "여행 규칙 생성 성공",
        result);
    }
  }

  // 여행 규칙 및 댓글 조회
  @Get('/detail/:ruleId')
  async getDetail(@Param('ruleId') ruleId: number, @Body() metaToBackDto: MetaToBackDto): Promise<ResponseDto<any>> {
    
    const result = await this.ruleService.getDetail(ruleId, metaToBackDto);

    if(!result){
      return new ResponseDto(
        ResponseCode.GET_RULE_DETAIL_FAIL,
        false,
        "여행 규칙 및 댓글 조회 실패",
        null
      );
    }
    else{
      return new ResponseDto(
        ResponseCode.GET_RULE_DETAIL_SUCCESS,
        true,
        "여행 규칙 및 댓글 조회 성공",
        result
      );
    }
  }

  // 여행 규칙 수정
  /*
  @Patch('/edit')
  async editRule(@Body() editRuleDto: EditRuleDto): Promise<ResponseDto<any>> {
    const result = await this.ruleService.createRule(createRuleDto);

    if(!result){
      return new ResponseDto(
          ResponseCode.RULE_CREATION_FAIL,
          false,
          "여행 규칙 생성 실패",
          null);

    }
    else{
      return new ResponseDto(
          ResponseCode.RULE_CREATED,
          true,
          "여행 규칙 생성 성공",
          result);
    }
   */

}
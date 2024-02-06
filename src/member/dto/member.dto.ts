import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MemberDto {
    @IsNotEmpty()
    @IsNumber()
    memberId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    nickName: string;

    @IsOptional()
    @IsString()
    introduction: string;

    @IsOptional()
    @IsString()
    image: string;
}
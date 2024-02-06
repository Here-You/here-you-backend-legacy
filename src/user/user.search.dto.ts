import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class UserSearchDto {
    @IsNotEmpty()
    @IsNumber()
    mateId: number;

    @IsNotEmpty()
    @IsString()
    nickName: string;

    @IsOptional()
    @IsString()
    introduction: string;

    @IsNotEmpty()
    @IsString()
    followerCnt: number;

    @IsOptional()
    @IsString()
    followingCnt: number;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsBoolean()
    isFollowing: boolean;
}
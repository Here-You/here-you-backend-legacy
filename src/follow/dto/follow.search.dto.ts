import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class FollowSearchDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

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
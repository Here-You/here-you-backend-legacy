import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FollowDto {
    @IsNotEmpty()
    @IsNumber()
    mateId: number;

    @IsNotEmpty()
    @IsString()
    nickName: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    introduction: string;

    @IsOptional()
    @IsNumber()
    followId: number;
}
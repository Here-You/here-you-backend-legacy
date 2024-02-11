import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class GetCommentDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsDate()
    updated: Date;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;
}
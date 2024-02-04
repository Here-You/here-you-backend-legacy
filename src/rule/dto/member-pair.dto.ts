import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberPairDto {
    @IsNotEmpty()
    @IsNumber()
    memberId: number;
  
    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}
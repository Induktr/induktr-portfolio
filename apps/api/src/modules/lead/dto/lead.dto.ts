import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum GqlLeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

registerEnumType(GqlLeadStatus, {
  name: 'LeadStatus',
});

@InputType()
export class CreateLeadInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  contact!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  budget!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  description!: string;

  @Field({ defaultValue: 'FULL_CYCLE_ENGINEERING' })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  referrer?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

@ObjectType()
export class LeadResponse {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  contact!: string;

  @Field()
  budget!: string;

  @Field()
  description!: string;

  @Field(() => GqlLeadStatus)
  status!: GqlLeadStatus;

  @Field()
  createdAt!: string;
}

import { Arg, Mutation, Resolver,Ctx } from 'type-graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UserModel } from '../entity/User';
import { AuthInput } from '../types/AuthInput';
import { UserResponse } from '../types/UserResponse';
import { MyContext } from 'types/MyContext';

@Resolver()
export class AuthResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('input')
    { email, password }: AuthInput, @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    // 1. check for existing user email
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // 2. create new user with hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPassword });
    await user.save();

    // 3. store user id on the token payload 
    const payload = {
      id: user.id,
    };

    const token = jwt.sign(
      payload,
      process.env.SESSION_SECRET || 'aslkdfjoiq12312'
    );

     ctx.res.cookie('accessToken', token, {
      path: '/',
        domain: 'localhost',
        httpOnly: true})


    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') { email, password }: AuthInput, @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid login');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid login');
    }

    // Store user id on the token payload
    const payload = {
      id: user.id,
    };

    const token = jwt.sign(
      payload,
      process.env.SESSION_SECRET || 'aslkdfjoiq12312'
    );

    ctx.res.cookie('accessToken', token, {
      path: '/',
        domain: 'localhost',
        httpOnly: true})

    return { user };
  }

  @Mutation(() => String)
  async logout(
    @Ctx() ctx: MyContext
  ) {
    // const { accessToken } = ctx.req.cookies;

    ctx.res.clearCookie('accessToken');
    return "Success"
  }
}
"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { LoginSchema, RegisterSchema, RegisterSchemaType, type LoginSchemaType } from "@/schemas";
import { authRoutes, DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import UserService from "@/lib/services/user-service";
import TokenService from "@/lib/services/token-servise";
import { send2FAMail, sendVerificationEmail } from "@/lib/mail";
import { generateConfirmation, tryDeleteExistingConfirmationByUserID } from "@/lib/services/two-factor-service";
import { getOperationFunctions } from "@/lib/utils";

const { success, error } = getOperationFunctions<{
  twoFactor?: boolean,
  redirectUrl?: string
}>();

export const credentialsLogin = async (values: LoginSchemaType) => {
  const parsed = LoginSchema.safeParse(values);

  if (!parsed.success) 
    return error("Invalid Fields");

  const { email, password, code } = parsed.data;

  const { data: userData } = await UserService.getUserByEmail(email);
  const existingUser = userData?.user;
  
  if (!existingUser || !existingUser?.email)
    return error("Email does not registered!");

  const validationRes = await UserService.validateUserCredentials(email, password);

  if (!validationRes.success) 
    return error(validationRes.message);

  const user = validationRes.data?.user;

  if (!user)
    return error("Unable to validate user!");

  if (!user.emailVerified) {
    const { data: existingTokenData } = await TokenService.getTokenByEmail("verification", email);
    const token = existingTokenData?.token;

    if (token && !TokenService.isExpired(token.expires)) {
      return error("Confirm your email by link on your mailbox!");
    }

    const { data: generatedTokenData } = await TokenService.generateToken("verification", email);

    const raw = generatedTokenData?.raw || "";

    if (raw) {
      await sendVerificationEmail(email, raw);

      return success("Confirmation email sent!");
    }
    else
      return error("Unable to sent confirmation email!");
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (!code) {
      const sendingResult = await send2FAMail(existingUser.email);

      return sendingResult?.success 
        ? success("Check your mailbox for code!", { twoFactor: true }) 
        : error("Unable to sent two factor code!");
    }

    const { data } = await TokenService.getTokenByValue("twoFactor", code);
    const token = data?.token;

    if (!token) {
      return error("Invalid Code!", { twoFactor: true });
    }

    if (TokenService.isExpired(token.expires))
      return error("Code has been expired! Click to \"Resend code\" button");

    await generateConfirmation(existingUser.id);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    await tryDeleteExistingConfirmationByUserID(existingUser.id);

    return success(
      "Welcome!", 
      { 
        redirectUrl: DEFAULT_LOGIN_REDIRECT, 
        twoFactor: false 
      });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin": return error("Invalid credentials");
        default: return error("Something went wrong!\n" + err.message);
      }
    }

    throw err;
  }
};

export async function register(values: RegisterSchemaType) {
    const validatedFields = RegisterSchema.safeParse(values);
    
    if (!validatedFields.success)
        return error("Register error occured!");

    const { email, password, username } = validatedFields.data;

    const result = await UserService.createUser({ email, password, name: username });

    if (!result.success)
      return error(result.message);

    const { data } = await TokenService.generateToken("verification", email);
    const raw = data?.raw;

    if (!raw)
      return error("Unable to sent verification token!");

    await sendVerificationEmail(email, raw);
    return success("Confirmation email sent");
};

export async function logout() {
    await signOut({ redirectTo: authRoutes.login });
};
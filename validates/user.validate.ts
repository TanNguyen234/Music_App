import User from "../model/user.model";

export function isValidEmail(email: string): Boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface Data {
  fullName: string;
  email: string;
  password: string;
}

export const valideRegiter = async (data: Data): Promise<Boolean> => {
  try {
    const { fullName, email, password } = data;
    if (!fullName || !email || !password || isValidEmail(email)) {
      throw new Error("invalid")
    }

    if (
      fullName.length < 8 ||
      fullName.length > 12 ||
      password.length < 8 ||
      password.length > 12
    ) {
        throw new Error("invalid")
    }

    const emailExist = await User.findOne({
      email: email,
    });

    if(emailExist) {
        throw new Error("invalid")
    }

    return true;
  } catch (err) {
    return false;
  }
};

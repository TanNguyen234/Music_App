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
    if (!fullName || !email || !password || !isValidEmail(email)) {
      throw new Error("invalid");
    }

    if (
      fullName.length < 8 ||
      fullName.length > 20 ||
      password.length < 8 ||
      password.length > 20
    ) {
      throw new Error("invalid");
    }

    const emailExist = await User.findOne({
      email: email,
    });

    if (emailExist) {
      throw new Error("invalid");
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};

interface Data2 {
  email: string;
  password: string;
}

export const validateLogin = async (data: Data2): Promise<Boolean> => {
  try {
    const { email, password } = data;
    if (!email || !password || !isValidEmail(email)) {
      throw new Error("invalid");
    }

    if (
      password.length < 8 ||
      password.length > 20
    ) {
      throw new Error("invalid");
    }

    return true;
  } catch (err) {
    return false;
  }
};

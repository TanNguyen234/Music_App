import Account from "../model/account.model";
import { isValidEmail } from "./user.validate";

interface TypeData {
    fullName: string;
    email: string;
    role_id: string;
    phone?: string;
    avatar?: string;
    status: string;
}

interface TypeData2 extends TypeData {
    password: string;
}

export const accountValidate = async (Data: TypeData2): Promise<Boolean> => {
    if (!Data.fullName || !isValidEmail(Data.email) || !Data.password || !Data.role_id) {
        return false;
    }
    const emailExist = await Account.findOne({
        email: Data.email,
        deleted: false
    })

    if (emailExist) {
        return false;
    }

    return true;
}

export const accountEditValidate = async (Data: TypeData): Promise<Boolean> => {
    if (!Data.fullName || !isValidEmail(Data.email) || !Data.role_id) {
        return false;
    }

    return true;
}
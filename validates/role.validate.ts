type TypeData = {
    title: string;
    description: string;
}

export const roleValidate = (Data: TypeData): Boolean => {
    if (!Data.title || !Data.description) {
        return false;
    }
    return true;
}
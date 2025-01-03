interface TypeData {
    title: string;
    description?: string;
    avatar?: string;
    status: 'active' | 'inactive';
}

export const validateTopic = (Data: TypeData): Boolean => {
    console.log(Data.title, Data.status)
    if (!Data.title) {
        return false;
    }
    if (!Data.status) {
        return false;
    }
    return true;
}
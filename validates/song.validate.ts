interface TypeData {
    title: string;
    topicId: string;
    status: 'active' | 'inactive';

    description?: string;
    avatar?: string;
    audio?: string;
    lyric?: string;
}

export const validateSong = (Data: TypeData): Boolean => {
    if (!Data.title) {
        return false;
    }
    if (Data.status!== 'active' && Data.status!== 'inactive') {
        return false;
    }
    if (!Data.topicId) {
        return false;
    }
    return true;
}
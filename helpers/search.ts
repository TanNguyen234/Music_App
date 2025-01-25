export const search = (query: any) => {
    let objectSearch = {
        keyword: ""
    }

    if (query.keyword) {           //Chức năng tìm kiếm
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");
        (objectSearch as any).regex = regex;
    }

    return objectSearch;
}
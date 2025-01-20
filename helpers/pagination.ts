import { objectPage } from "../interface/objectPage";


const pagination = (objectPagination: objectPage, query: any, countProducts: number): objectPage => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = ((objectPagination.currentPage - 1) * objectPagination.limitItem);
    
    const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}

export default pagination;
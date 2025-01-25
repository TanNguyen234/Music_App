import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import { validateTopic } from "../../validates/validate-topic.validate";
import { systemConfig } from "../../config/config";
import { CustomRequest } from "../../interface/CustomRequest";
import { objectPage } from "../../interface/objectPage";
import pagination from "../../helpers/pagination";
import { search } from "../../helpers/search";
import { filterStatus } from "../../helpers/filterStatus";
import { Find } from "../../interface/query";

//[GET] /admin/topics
export const index = async (req: Request, res: Response): Promise<void> => {
  const filterStatusHelper = filterStatus(req.query);  //Trả về một mảng chứa các trạng thái của sản phẩm

  let find: Find = {
    deleted: false
  }
  if (req.query.status) {            //Có req.query.status có ngĩa là trên url có key tên status do frontend truyền lên url
    find.status = req.query.status //Thêm status vào oject find => find.status
  }

  const objectSearch: any = search(req.query);

  if (objectSearch.regex) {
      find.title = objectSearch.regex;
  }

  //Pagination
  const totalTopic: number = await Topic.countDocuments(find);

  let objectPagination: objectPage = pagination(
    {
      currentPage: 1,
      limitItem: 5,
    },
    req.query,
    totalTopic
  );
  //End Pagination

  //Sort
  let sort: any = {

  }

  if (req.query.sortKey && req.query.sortValue) {
    const key: string | any = req.query.sortKey
    const value: string | any = req.query.sortValue
    sort[key] = value
  } else {
    sort.like = "desc"
  }
  //End Sort

  const topics = await Topic.find({
    deleted: false,
  }).skip(objectPagination.skip).limit(objectPagination.limitItem).sort(sort);

  res.render("admin/pages/topics/index", {
    pageTitle: "Trang chủ đề",
    topics: topics || [],
    pagination: objectPagination,
    filterStatus: filterStatusHelper,
    keyword: objectSearch.keyword,
  });
};

//[GET] /admin/topics/create
export const create = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/topics/create", {
    pageTitle: "Tạo chủ đề mới",
  }); 
};

//[POST] /admin/topics/create
export const createPost = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (validateTopic(req.body)) {
    const newTopic = new Topic(req.body);
    await newTopic.save();
    req.flash("success", "Tạo chủ đề mới thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  } else {
    req.flash("error", "Dữ liệu không hợp lệ");
    res.redirect("back");
  }
};

//[GET] /admin/topics/edit/:id
export const edit = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      throw new Error("Invalid");
    }
    const topic = await Topic.findById(req.params.id);

    if (!topic) throw new Error("id is invalid");

    res.render("admin/pages/topics/edit", {
      pageTitle: "Chỉnh sửa chủ đề",
      topic: topic || {},
    });
  } catch (error) {
    req.flash("error", "Chủ đề không tồn tại")
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
};

//[PATCH] /admin/topics/edit/:id
export const editPatch = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  if (validateTopic(req.body) && id) {
    try {
      await Topic.updateOne(
        {
          _id: id,
        },
        req.body
      );
      req.flash("success", "Chỉnh sửa chủ đề thành công");
      res.redirect("back");
    } catch (error) {
      req.flash("error", "Không tìm thấy chủ đề");
      res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
  } else {
    req.flash("error", "Dữ liệu không hợp lệ");
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  }
};

//[DELETE] /admin/topics/delete/:id
export const deleteTopic = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  if (id) {
    try {
      await Topic.updateOne(
        {
          _id: id,
        },
        {
          deleted: true,
        }
      );
      req.flash("success", "Xóa chủ đề thành công");
      res.redirect("back");
    } catch (error) {
      req.flash("error", "Xóa chủ đề thất bại");
      res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
  } else {
    req.flash("error", "id không hợp lệ");
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  }
};

//[GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    try {
        if(!id) throw new Error('Invalid id')
            const topic = await Topic.findOne({
                _id: id,
                deleted: false,
              });
              if (topic) {
                res.render("admin/pages/topics/detail", {
                  pageTitle: "Chi tiết chủ đề",
                  topic: topic,
                });
              } else {
                throw new Error("Invalid")
              }
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
};

import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import { validateTopic } from "../../validates/validate-topic.validate";
import { systemConfig } from "../../config/config";
import { CustomRequest } from "../../interface/CustomRequest";

//[GET] /admin/topics
export const index = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({
    deleted: false,
  });

  res.render("admin/pages/topics/index", {
    pageTitle: "Trang chủ đề",
    topics: topics || [],
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

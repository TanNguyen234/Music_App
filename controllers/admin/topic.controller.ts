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
import { Status } from "../../interface/status";
import Account from "../../model/account.model";

//[GET] /admin/topics
export const index = async (req: Request, res: Response): Promise<void> => {
  const filterStatusHelper = filterStatus(req.query); //Trả về một mảng chứa các trạng thái của sản phẩm

  let find: Find = {
    deleted: false,
  };
  if (req.query.status) {
    //Có req.query.status có ngĩa là trên url có key tên status do frontend truyền lên url
    find.status = req.query.status; //Thêm status vào oject find => find.status
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
  let sort: any = {};

  if (req.query.sortKey && req.query.sortValue) {
    const key: string | any = req.query.sortKey;
    const value: string | any = req.query.sortValue;
    sort[key] = value;
  } else {
    sort.like = "desc";
  }
  //End Sort

  const topics = await Topic.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem)
    .sort(sort);
  for (const topic of topics) {
    if (topic.createdBy) {
      const admin = await Account.findOne({
        _id: topic.createdBy.account_id,
      });

      if (admin) {
        (topic as any).accountFullName = admin.fullName;
      }
    }
    const updatedBy = topic.updatedBy[topic.updatedBy.length - 1];
    if (updatedBy) {
      const adminUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });

      (topic as any).accountFullNameUpdated = adminUpdated?.fullName;
    }
  }

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
  const permissions = res.locals.admin.permissions;
  if (!permissions.includes("topic_create")) {
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    return;
  }
  if (validateTopic(req.body)) {
    req.body.createdBy = {
      account_id: res.locals.admin.id,
      delete_at: new Date(),
    };
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
    req.flash("error", "Chủ đề không tồn tại");
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
      const permissions = res.locals.admin.permissions;
      if (!permissions.includes("topic_edit")) {
        throw new Error(`Invalid`);
      }
      await Topic.updateOne(
        {
          _id: id,
        },
        {
          ...req.body,
          $push: {
            updatedBy: {
              account_id: res.locals.admin.id,
              delete_at: new Date(),
            },
          },
        }
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
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions = res.locals.admin.permissions;
    if (!permissions.includes("topic_delete")) {
      throw new Error("Permissions must be specified");
    }
    const id: string = req.params.id;
    if (!id) throw new Error("Invalid");
    await Topic.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          account_id: res.locals.admin.id,
          delete_at: new Date(),
        },
        deleted: true,
      }
    );
    res.json({
      code: 200,
      message: "Xóa chủ đề thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa chủ đề thất bại",
    });
  }
};

//[GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  try {
    if (!id) throw new Error("Invalid id");
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
      throw new Error("Invalid");
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  }
};

//[PATCH] /admin/topics/change-status
export const changeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id: string = req.body.id;
  const status: Status = req.body.status;
  try {
    const permissions = res.locals.admin.permissions;
    if (!permissions.includes("topic_edit")) {
      throw new Error("Permissions must be specified");
    }
    if (!id) {
      throw new Error(`Invalid`);
    }
    await Topic.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        $push: {
          updatedBy: {
            account_id: res.locals.admin.id,
            delete_at: new Date(),
          },
        },
      }
    );
    res.json({
      code: 200,
      message: "Thay đổi trạng thái bài hát thành công",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thay đổi trạng thái bài hát thất bại",
    });
  }
};

// [PATCH] /admin/songs/change-multi
export const changeMulti = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const type = req.body.type;

  const ids = req.body.ids.split(", "); //conver từ string thành array

  const updated = {
    account_id: res.locals.admin.id,
    delete_at: new Date(),
  };
  const permissions = res.locals.admin.permissions;

  switch (type) {
    case "active":
      if (permissions.includes("topic_edit")) {
        await Topic.updateMany(
          { _id: { $in: ids } },
          {
            status: "active",
            $push: { updatedBy: updated },
          }
        );

        req.flash(
          "success",
          `Đã cập nhật thành công trạng thái của ${ids.length} sản phẩm`
        );
      }

      break;
    case "inactive":
      if (permissions.includes("topic_edit")) {
        await Topic.updateMany(
          { _id: { $in: ids } },
          {
            status: "inactive",
            $push: { updatedBy: updated },
          }
        );

        req.flash(
          "success",
          `Đã cập nhật thành công trạng thái của ${ids.length} sản phẩm`
        );
      }

      break;
    case "delete-all":
      if (permissions.includes("topic_delete")) {
        await Topic.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedBy: updated }
        );

        req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
      }
      break;
    default:
      break;
  }

  res.redirect("back");
};

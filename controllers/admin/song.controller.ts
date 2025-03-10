import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { validateSong } from "../../validates/song.validate";
import { systemConfig } from "../../config/config";
import { CustomRequest } from "../../interface/CustomRequest";
import { objectPage } from "../../interface/objectPage";
import pagination from "../../helpers/pagination";
import { Find } from "../../interface/query";
import { filterStatus } from "../../helpers/filterStatus";
import { search } from "../../helpers/search";
import { Status } from "../../interface/status";
import Account from "../../model/account.model";

//[GET] /admin/songs
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
  const totalSong: number = await Song.countDocuments(find);

  let objectPagination: objectPage = pagination(
    {
      currentPage: 1,
      limitItem: 10,
    },
    req.query,
    totalSong
  );
  //End Pagination

  //Sort
  let sort: any = {};

  if (req.query.sortKey && req.query.sortValue) {
    const key: string | any = req.query.sortKey;
    const value: string | any = req.query.sortValue;
    sort[key] = value;
  }
  //End Sort

  const songs = await Song.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem)
    .sort(sort);
  for (const song of songs) {
    if (song.createdBy) {
      let admin = await Account.findOne({
        _id: song.createdBy.account_id,
      });

      if (admin) {
        (song as any).accountFullNameCreated = admin.fullName;
      }
    }

    const updatedBy = song.updatedBy[song.updatedBy.length - 1];
    if (updatedBy) {
      const adminUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });

      (song as any).accountFullNameUpdated = adminUpdated?.fullName;
    }
  }

  res.render("admin/pages/songs/index", {
    pageTitle: "Trang bài hát",
    songs: songs || [],
    pagination: objectPagination,
    filterStatus: filterStatusHelper,
    keyword: objectSearch.keyword,
  });
};

//[GET] /admin/songs/create
export const create = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({
    deleted: false,
  });
  res.render("admin/pages/songs/create", {
    pageTitle: "Tạo bài hát mới",
    topics: topics || [],
  });
};

//[POST] /admin/songs/createPost
export const createPost = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (validateSong(req.body)) {
    req.body.createdBy = {
      account_id: res.locals.admin.id,
      delete_at: new Date(),
    };
    const newSong = new Song(req.body);
    await newSong.save();
    req.flash("success", "Tạo bài hát mới thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } else {
    req.flash("error", "Dữ liệu không hợp lệ");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }
};

//[GET] /admin/songs/edit/:id
export const edit = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  try {
    if (!id) {
      throw new Error("id is invalid");
    }

    const song = await Song.findOne({
      _id: id,
    });

    if (!song) {
      throw new Error(`Song not found`);
    }

    const topics = await Topic.find({
      deleted: false,
    });

    res.render(`admin/pages/songs/edit`, {
      pageTitle: "Cập nhật bài hát",
      song: song,
      topics: topics,
    });
  } catch (error) {
    req.flash("error", "Bài hát không tồn tại!");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }
};

//[PATCH] /admin/songs/edit/:id
export const editPatch = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  if (validateSong(req.body) && id) {
    try {
      await Song.updateOne(
        {
          _id: id,
        },
        {
          ...req.body,
          $push: {
            account_id: res.locals.user.id,
            update_at: new Date(),
          },
        }
      );
      req.flash("success", "Chỉnh sửa bài hát thành công");
      res.redirect(
        req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
      );
    } catch (error) {
      req.flash("error", "Không tìm thấy bài hát");
      res.redirect(`/${systemConfig.prefixAdmin}/songs`);
    }
  } else {
    req.flash("error", "Dữ liệu không hợp lệ");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }
};

//[GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  try {
    if (!id) throw new Error("Invalid id");
    const song = await Song.findOne({
      _id: id,
      deleted: false,
    });
    const topic = await Topic.findOne({
      _id: song?.topicId,
      deleted: false
    })
    if (song && topic) {
      res.render("admin/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song,
        topic
      });
    } else {
      throw new Error("Invalid");
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/songss`);
  }
};

//[DELETE] /admin/songs/delete/:id
export const deleteSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id;

    if (!id) {
      throw new Error(`Invalid`);
    }

    await Song.updateOne(
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
      message: "Xóa bài hát thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa bài hát thất bại",
    });
  }
};

//[PATCH] /admin/songs/change-status
export const changeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.body.id;
    const status: Status = req.body.status;
    if (!id) {
      throw new Error(`Invalid`);
    }
    await Song.updateOne(
      {
        _id: id,
      },
      {
        status: status,
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
    update_at: new Date(),
  };

  switch (type) {
    case "active":
      await Song.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updated },
        }
      );

      req.flash(
        "success",
        `Đã cập nhật thành công trạng thái của ${ids.length} bài hát`
      );

      break;
    case "inactive":
      await Song.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updated },
        }
      );

      req.flash(
        "success",
        `Đã cập nhật thành công trạng thái của ${ids.length} bài hát`
      );

      break;
    case "delete-all":
      await Song.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedBy: updated }
      );

      req.flash("success", `Đã xóa thành công ${ids.length} bài hát`);
      break;
    default:
      break;
  }

  res.redirect(
    req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
  );
};

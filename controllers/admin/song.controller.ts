import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { validateSong } from "../../validates/song.validate";
import { systemConfig } from "../../config/config";
import { CustomRequest } from "../../interface/CustomRequest";

//[GET] /admin/songs
export const index = async (req: Request, res: Response): Promise<void> => {
  const songs = await Song.find({
    deleted: false,
  });

  res.render("admin/pages/songs/index", {
    pageTitle: "Trang bài hát",
    songs: songs || [],
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
        req.body
      );
      req.flash("success", "Chỉnh sửa bài hát thành công");
      res.redirect("back");
    } catch (error) {
      req.flash("error", "Không tìm thấy bài hát");
      res.redirect(`/${systemConfig.prefixAdmin}/songs`);
    }
  } else {
    req.flash("error", "Dữ liệu không hợp lệ");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }
};

//[DELETE] /admin/songs/delete/:id
export const deleteSong = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const id: string = req.params.id;
    try {
        if(!id) {
            throw new Error(`Invalid`)
        }
        await Song.updateOne(
          {
            _id: id,
          },
          {
            deleted: true,
          }
        );
        req.flash("success", "Xóa bài hát thành công");
        res.redirect("back");
      } catch (error) {
        req.flash("error", "Xóa bài hát thất bại");
        res.redirect(`/${systemConfig.prefixAdmin}/songs`);
      }
  };
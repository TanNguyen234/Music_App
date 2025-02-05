import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { CustomRequest } from "../../interface/CustomRequest";
import User from "../../model/user.model";
import FavoriteSong from "../../model/favorite-song.model";
import pagination from "../../helpers/pagination";
import { objectPage } from "../../interface/objectPage";

//[GET] /songs
export const index = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: String | unknown = req.query.id || "";
  var songs = null,
    topic = null;
  //Filter
  if (id) {
    topic = await Topic.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });

    if (!topic) {
      req.flash("error", "id chủ đề không hợp lệ!");
      res.redirect("/topics");
    } else {
      songs = await Song.find({
        status: "active",
        topicId: id,
        deleted: false,
      });
    }
  } else {
    songs = await Song.find({
      status: "active",
      deleted: false,
    });
  }
  //End Filter

  //Pagination
  const totalSong: number = songs?.length || 0;

  let objectPagination: objectPage = pagination(
    {
      currentPage: 1,
      limitItem: 10,
    },
    req.query,
    totalSong
  );
  //End Pagination

  if (id) {
    songs = await Song.find({
      status: "active",
      topicId: id,
      deleted: false,
    })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip); //Dùng find(hàm của mongoose) để lọc các dữ liệu từ database;
    
  } else {
    songs = await Song.find({
      status: "active",
      deleted: false,
    })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip); //Dùng find(hàm của mongoose) để lọc các dữ liệu từ database;
  }

  const topics = await Topic.find({
    status: "active",
    deleted: false,
  }).select("title");

  res.render("client/pages/songs/song", {
    pageTitle: "Trang bài hát",
    objectPagination: objectPagination,
    topics: topics,
    topic: topic || null,
    songs: songs || [],
  });
};
//[GET] /songs/:id
export const listen = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: String | unknown = req.params.id;
  if (id) {
    const song = await Song.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });
    if (!song) {
      req.flash("error", "id bài hát không hợp lệ!");
      res.redirect("/songs");
    } else {
      await Song.updateOne(
        {
          _id: id,
        },
        {
          listen: song.listen + 1,
        }
      );

      var inPlayList = false;

      const checkInPlayList = await User.findOne({
        token: req.cookies.tokenUser,
        playlist: { $in: [id] },
      });

      const user = await User.findOne({
        token: req.cookies.tokenUser,
      });

      const favorite = await FavoriteSong.findOne({
        userId: user?._id,
        songId: id,
      });

      if (checkInPlayList) inPlayList = true;

      res.render("client/pages/songs/listen", {
        pageTitle: "Nghe bài hát",
        song: song,
        inPlayList: inPlayList,
        favorite: favorite ? true : false,
      });
    }
  } else {
    res.redirect("/topics");
  }
};
//[PATCH] /songs/eventSong/:id
export const eventSong = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const songId = req.params.id;
    const { type, value } = req.query;
    const song = await Song.findOne({
      _id: songId,
    });
    if (!song) throw new Error("");
    const like = song.like;
    switch (type) {
      case "like":
        const user = await User.findOne({
          token: req.cookies.tokenUser,
        });
        if (value === "favorite") {
          await Song.updateOne(
            {
              _id: songId,
            },
            {
              like: like + 1,
            }
          );
          await new FavoriteSong({
            userId: user?._id,
            songId: songId,
          }).save();
        } else if (value === "unfavorite") {
          await Song.updateOne(
            {
              _id: songId,
            },
            {
              like: like - 1,
            }
          );
          await FavoriteSong.deleteOne({
            userId: user?._id,
            songId: songId,
          });
        }
        break;

      case "playlist":
        if (value === "del") {
          await User.updateOne(
            {
              token: req.cookies.tokenUser,
            },
            {
              $pull: {
                playlist: songId,
              },
            }
          );
        } else if (value === "push") {
          await User.updateOne(
            {
              token: req.cookies.tokenUser,
            },
            {
              $push: {
                playlist: songId,
              },
            }
          );
        }
        break;
      default:
        break;
    }
    res.json({
      code: 200,
      like: value === "favorite" ? like + 1 : like - 1 < 0 ? 0 : like - 1
    });
  } catch (err) {
    res.json({
      code: 400,
    });
  }
};

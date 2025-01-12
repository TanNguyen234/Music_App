import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { CustomRequest } from "../../interface/CustomRequest";

//[GET] /songs
export const index = async (req: CustomRequest, res: Response): Promise<void> => {
  const id: String | unknown = req.query.id;
  var songs = null,
    topic = null;
  if (id) {
    topic = await Topic.find({
      id: id,
      status: "active",
      deleted: false,
    });
    if (!topic) {
        req.flash('error', "id chủ đề không hợp lệ!")
      res.redirect("/topics");
    } else {
      songs = await Song.find({
        topicId: id,
        status: "active",
        deleted: false,
      });
    }
  } else {
    songs = await Song.find({
      status: "active",
      deleted: false,
    });
  }

  res.render("client/pages/songs/song", {
    pageTitle: "Trang bài hát",
    topic: topic || null,
    songs: songs || [],
  });
};

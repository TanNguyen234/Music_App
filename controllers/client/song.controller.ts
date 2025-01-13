import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { CustomRequest } from "../../interface/CustomRequest";

//[GET] /songs
export const index = async (req: CustomRequest, res: Response): Promise<void> => {
  const id: String | unknown = req.query.id;
  var songs = null, topic = null;
  if (id) {
    topic = await Topic.findOne({
      _id: id,
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

  const topics = await Topic.find({
    status: "active",
    deleted: false
  }).select("title")
  console.log(id, topic, songs)
  res.render("client/pages/songs/song", {
    pageTitle: "Trang bài hát",
    topics: topics || [],
    topic: topic || null,
    songs: songs || [],
  });
};

export const listen = async (req: CustomRequest, res: Response): Promise<void> => {
  const id: String | unknown = req.params.id;
  if (id) {
    const song = await Song.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });
    if (!song) {
      req.flash('error', "id bài hát không hợp lệ!")
      res.redirect("/songs");
    } else {
      res.render('client/pages/songs/listen', {
        pageTitle: "Nghe bài hát",
        song: song,
      })
    }
  } else {
    res.redirect('/topics')
  }
}
import { Request, Response } from "express";
import Song from "../../model/song.model";
import { CustomRequest } from "../../interface/CustomRequest";
import User from "../../model/user.model";
import pagination from "../../helpers/pagination";
import { objectPage } from "../../interface/objectPage";

//[GET] /playlist
export const index = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const user = await User.findOne({
    status: "active",
    deleted: false,
    token: req.cookies.tokenUser,
  });

  var songs = [];

  songs = await Song.find({
    _id: { $in: [user?.playlist] },
  });

  //Pagination
  const totalSong: number = songs?.length || 0;

  let objectPagination: objectPage = pagination(
    {
      currentPage: 1,
      limitItem: 20,
    },
    req.query,
    totalSong
  );
  //End Pagination

  songs = await Song.find({
    status: "active",
    _id: { $in: [user?.playlist] },
    deleted: false,
  })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip); //Dùng find(hàm của mongoose) để lọc các dữ liệu từ database;

  res.render("client/pages/playlist/playlist", {
    pageTitle: "My playlist",
    songs: songs,
    pagination: objectPagination
  });
};

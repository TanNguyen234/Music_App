import { Request, Response } from "express"
import Song from "../../model/song.model"

//[GET] /
export const index = async (req: Request, res: Response): Promise<void> => {
    const songs = await Song.find({
        deleted: false,
    })
    res.render('client/pages/dashboard/dashboard', {
        pageTitle: 'Trang Chủ',
        songs: songs
    })
}
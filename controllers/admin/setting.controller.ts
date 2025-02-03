import { Request, Response } from "express"
import { CustomRequest } from "../../interface/CustomRequest"
import SettingGeneral from "../../model/setting.model"
import { systemConfig } from "../../config/config"

//[GET] /admin/seting/general
export const general = async (req: Request, res: Response): Promise<void> => {
    const general = await SettingGeneral.findOne({})
    res.render('admin/pages/settings/general', {
        pageTitle: 'Cài đặt chung',
        general
    })
}

//[PATCH] /admin/setting/general
export const generalPatch = async (req: CustomRequest, res: Response): Promise<void> => {
    const settingGeneral = await SettingGeneral.findOne({})

    if(settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body)
    } else {
        const record = new SettingGeneral(req.body)
        record.save()
    }
    req.flash('success', 'Cập nhật cài đặt chung thành công!')
    res.redirect(req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`)
}
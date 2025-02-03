import { Request, Response } from "express";
import Roles from "../../model/role.model";
import { CustomRequest } from "../../interface/CustomRequest";
import { roleValidate } from "../../validates/role.validate";
import { systemConfig } from "../../config/config";
import Account from "../../model/account.model";
import {
  accountEditValidate,
  accountValidate,
} from "../../validates/account.validate";
import argon2 from "argon2";
import { Status } from "../../interface/status";
import pagination from "../../helpers/pagination";
import { objectPage } from "../../interface/objectPage";
import { search } from "../../helpers/search";
import { Find } from '../../interface/query';
import { filterStatus } from "../../helpers/filterStatus";

//[GET] /admin/accounts
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
    find.fullName = objectSearch.regex;
  }

  //Pagination
  const totalSong: number = await Account.countDocuments(find);

  let objectPagination: objectPage = pagination(
    {
      currentPage: 1,
      limitItem: 5,
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
  } else {
    sort.like = "desc";
  }
  //End Sort

  const accounts = await Account.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem)
    .sort(sort)
    .select("-password -token")

  for (let account of accounts) {
    const role = await Roles.findOne({
      _id: account.role_id,
    });
    (account as any).role = role?.title;
  }

  res.render("admin/pages/accounts/index", {
    titlePage: "Trang danh sách tài khoản",
    accounts: accounts || [],
    pagination: objectPagination,
    filterStatus: filterStatusHelper,
    keyword: objectSearch.keyword,
  });
};

//[GET] /admin/accounts/create
export const create = async (req: Request, res: Response): Promise<void> => {
  const roles = await Roles.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    titlePage: "Tạo tài khoản mới",
    roles: roles || [],
  });
};

//[POST] /admin/accounts/create
export const createPost = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const condition = await accountValidate(req.body);
  if (condition) {
    req.body.password = await argon2.hash(req.body.password);

    let account = new Account(req.body);
    await account.save();

    req.flash("success", "Thêm tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    req.flash("error", "Tạo tài khoản thất bại");
    res.redirect(
      req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
    );
  }
};

//[GET] /admin/accounts/edit/:id
export const edit = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.params.id) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-token -password");
    if (!account) {
      req.flash("error", "Không tìm thấy nhóm quyền");
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
    const roles = await Roles.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/edit", {
      titlePage: "Chỉnh sửa quyền",
      account: account,
      roles: roles || [],
    });
  }
};

//[PATCH] /admin/roles/edit/:id
export const editPatch = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const condition = await accountEditValidate(req.body);
  if (condition) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    } else {
      delete req.body.password
    }

    await Account.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", "Chỉnh sửa tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.redirect(
      req.get("Referrer") || `/${systemConfig.prefixAdmin}/dashboard`
    );
  }
};

//[PATCH] /admin/accounts/change-status
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
    await Account.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    res.json({
      code: 200,
      message: "Thay đổi trạng admin thành công",
    });
  } catch (error) {
    res.json({
      code: 500,
      message: "Thay đổi trạng thái admin thất bại",
    });
  }
};

//[DELETE] /admin/roles/delete/:id
export const deleteRole = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  if (!id) {
    res.json({
      code: 400,
      message: "Không tìm thấy nhóm quyền",
    });
  }
  await Account.updateOne(
    {
      _id: id,
    },
    {
      deleted: true,
    }
  );
  res.json({
    code: 200,
    message: "Xóa nhóm quyền thành công",
  });
};
export type Response<T> = {
  err_no: number;
  err_msg: string;
  data: T;
};

export type UserMonthlyActivity = Response<
  {
    date: number;
    status: number;
    point: number;
  }[]
>;

export type UserCheckInStatus = Response<{
  check_in_done: boolean;
  lt_task_exist: boolean;
  extra: string | null;
}>;

export type PushPlusResponse = {
  code: number;
  msg: string;
  data: string;
  count: number | null;
};

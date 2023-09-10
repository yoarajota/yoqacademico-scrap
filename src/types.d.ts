export type Data = {
  data_name: string;
  data_value: number | string;
};

export type PartDiario = {
  course_name: string;
  data: Array<Data>;
};

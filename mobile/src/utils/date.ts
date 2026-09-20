import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { capitalize } from "./text";

dayjs.locale("pt-br");

export const getDayWeek = (date: Date) => {
  return capitalize(dayjs(date).format("dddd, D [de] MMMM"));
};

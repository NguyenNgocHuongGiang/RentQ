import dayjs from "dayjs";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const getAuthData = () => {
  const token = localStorage.getItem("authInfo");

  if (token) {
    const decodedToken = jwtDecode<JwtPayload & { data?: any }>(token);
    if (decodedToken.data) {
      return decodedToken.data;
    }
    return null;
  }
  return null;
};

export const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const generateAlias = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-"); 
};

export const checkLogin = (navigate: (path: string) => void) => {
  const authData = localStorage.getItem("authInfo");

  if (!authData) {
    navigate("/auth/login");
    return;
  }
};

export const numberToVietnameseWords = (number:number) => {
  if (number === 0) return "không đồng";

  const unitNumbers = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const placeValues = ["", "nghìn", "triệu", "tỷ"];

  function readTriple(number : number) {
    let hundreds = Math.floor(number / 100);
    let tens = Math.floor((number % 100) / 10);
    let units = number % 10;

    let result = "";

    if (hundreds > 0) {
      result += unitNumbers[hundreds] + " trăm";
      if (tens === 0 && units > 0) result += " lẻ";
    }

    if (tens > 1) {
      result += " " + unitNumbers[tens] + " mươi";
      if (units === 1) result += " mốt";
      else if (units === 5) result += " lăm";
      else if (units > 1) result += " " + unitNumbers[units];
    } else if (tens === 1) {
      result += " mười";
      if (units === 1) result += " một";
      else if (units === 5) result += " lăm";
      else if (units > 1) result += " " + unitNumbers[units];
    } else if (tens === 0 && units > 0 && hundreds === 0) {
      result += unitNumbers[units];
    } else if (tens === 0 && units > 0) {
      result += " " + unitNumbers[units];
    }

    return result.trim();
  }

  let result = "";
  let place = 0;

  while (number > 0) {
    let triple = number % 1000;

    if (triple > 0) {
      let tripleWords = readTriple(triple);
      if (place > 0) tripleWords += " " + placeValues[place];
      result = tripleWords + " " + result;
    }

    number = Math.floor(number / 1000);
    place++;
  }

  return result.trim() + " đồng";
}

export const normalizeContractData = (data: any) => ({
  landlord_id: Number(data.landlord_id),
  property_id: Number(data.property_id),
  deposit: Number(data.deposit),
  rent: Number(data.rent),
  start_date: data.start_date ? dayjs(data.start_date).toISOString() : null,
  end_date: data.end_date ? dayjs(data.end_date).toISOString() : null,
  actual_move_in_date: data.actual_move_in_date
    ? dayjs(data.actual_move_in_date).toISOString()
    : null,
  status: data.status,
  contract_file_url: data.contract_file_url?.trim(),
  terms_and_conditions: data.terms_and_conditions?.trim(),
});


export function toISOStringLocal(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0]; 
}
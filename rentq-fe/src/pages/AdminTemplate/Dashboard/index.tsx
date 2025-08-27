import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { getUserProperties } from "../../../store/slice/propertySlice";
import { getAuthData } from "../../../utils/helpers";
import { getLandlordContracts } from "../../../store/slice/contractSlice";
import { getLandlordBills } from "../../../store/slice/billSlice";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUserProperties(getAuthData()?.userId)).unwrap();
    dispatch(getLandlordContracts(getAuthData()?.userId)).unwrap();
    dispatch(
      getLandlordBills({
        user_id: getAuthData()?.userId,
        yearNumber: new Date().getFullYear().toString(),
      })
    );
  }, []);
  return <div>Dashboard</div>;
};

export default Dashboard;

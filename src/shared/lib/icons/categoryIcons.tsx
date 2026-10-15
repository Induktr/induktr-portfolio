import React from "react";
import { 
  MdWeb,
  MdPhoneAndroid,
  MdPayments,
  MdMessage,
  MdSmartToy,
} from "react-icons/md";
import { ArrowUpCircle } from "lucide-react";

export const getCategoryIcon = (iconName: string, className = "w-6 h-6"): React.ReactNode => {
  switch (iconName) {
    case "browser":
      return <MdWeb className={className} />;
    case "mobile":
      return <MdPhoneAndroid className={className} />;
    case "finance":
      return <MdPayments className={className} />;
    case "message":
      return <MdMessage className={className} />;
    case "ai":
      return <MdSmartToy className={className} />;
    case "trading":
      return <ArrowUpCircle className={className} />;
    default:
      return <MdWeb className={className} />;
  }
};

import { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import InheriGeneForm from "./AnalyseInherigene";
import OnquerForm from "./AnalyseOnquer";

function Form() {
  const { isInherigene } = useSelector((state) => state.login);
  return <>{isInherigene ? <InheriGeneForm /> : <OnquerForm />}</>;
}
export default Form;

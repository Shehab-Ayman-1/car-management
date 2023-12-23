import { Option, Select } from "@material-tailwind/react";
import { cloneElement } from "react";
import { useTranslation } from "react-i18next";

import { Loading } from "@/layout/Loading";

export const Selectbox = ({
   label = "",
   selectStyle = "",
   containerStyle = "",
   labelStyle = "",
   menuStyle = "",
   value = "",
   loading = false,
   options = [],
   ...rest
}) => {
   const [, i18next] = useTranslation();
   return (
      <Select
         label={label}
         variant="standard"
         color="deep-purple"
         size="lg"
         className="select-box w-full text-base caret-primary dark:text-white/80 md:text-xl"
         required
         selected={(element) =>
            element &&
            cloneElement(value ? element : <p>{label}</p>, {
               disabled: true,
               className: "flex items-center opacity-100 gap-2 pointer-events-none",
            })
         }
         containerProps={{
            className: `h-14 md:h-20 border-b-sp !border-deep-purple-300 ${containerStyle}`,
         }}
         labelProps={{
            className: `text-xl peer-focus:text-xl peer-placeholder-shown:text-xl ${labelStyle}`,
         }}
         menuProps={{
            className: `bg-gradient py-3 ${menuStyle}`,
         }}
         animate={{
            initial: { y: 25 },
            mount: { y: 0 },
            unmount: { y: 25 },
         }}
         {...rest}
      >
         {options.length ? (
            options?.map((value, i) => (
               <Option className="text-xl hover:!bg-dimPurple hover:dark:text-white" value={value} key={i}>
                  {value}
               </Option>
            ))
         ) : loading ? (
            <Option className="flex-start text-xl" value="">
               <Loading subLoading />
            </Option>
         ) : (
            <Option className="text-xl" value="">
               {i18next.language === "en" ? "There Are No Search Results" : "لا يوجد نتائج بحث"}
            </Option>
         )}
      </Select>
   );
};

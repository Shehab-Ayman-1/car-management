import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getLists, setCompanies } from "@/redux/slices/products";
import { Field, Form, Selectbox } from "@/components/public";
import { carLogo } from "@/assets";
import { useAxios } from "@/hooks/useAxios";
import { Loading } from "@/layout/loading";

export const Company = () => {
   const [formData, setFormData] = useState({ img: "", category: "", company: "" });
   const { data, loading, error, isSubmitted, refetch } = useAxios();
   const { loading: lLoading, isSubmitted: lIsSubmitted, refetch: listsRefetch } = useAxios();
   const { lists, categories } = useSelector(({ products }) => products);
   const dispatch = useDispatch();

   useEffect(() => {
      if (lists.length) return;

      (async () => {
         const { data, isSubmitted, error } = await listsRefetch("get", "/products/get-products-list");
         if (isSubmitted && error) return;
         dispatch(getLists(data));
      })();
   }, []);

   const handleSelectChange = (name, value) => {
      setFormData((data) => ({ ...data, [name]: value }));
   };

   const handleFieldChange = (event) => {
      setFormData((data) => ({ ...data, [event.target.name]: event.target.value }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      const { isSubmitted, error } = await refetch("post", "/products/create-company", formData);
      if (isSubmitted && error) return;

      dispatch(setCompanies({ category: formData.category, company: formData.company }));
   };

   return (
      <Form
         onSubmit={handleSubmit}
         headerText="اضافه شركة جديد"
         buttonText="انشاء"
         loading={(isSubmitted && !error) || loading}
      >
         <Loading
            isSubmitted={isSubmitted}
            loading={loading}
            error={error}
            message={data}
            to="/creates/products"
         />

         <div className="w-full">
            <img
               src={formData.img || carLogo}
               alt="product"
               className="m-auto mb-4 block h-28 w-28 rounded-full shadow-sp"
            />
            <Field label="رابط الصورة" name="img" value={formData.img} onChange={handleFieldChange} />
         </div>

         <Selectbox
            label="اختر اسم القسم..."
            value={formData.category}
            options={categories}
            loading={!lIsSubmitted && lLoading}
            onChange={(value) => handleSelectChange("category", value)}
         />

         <Field label="اسم الشركة" name="company" value={formData.company} onChange={handleFieldChange} />
      </Form>
   );
};

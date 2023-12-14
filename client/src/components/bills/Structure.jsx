import { Button, Card, IconButton, Typography } from "@material-tailwind/react";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Field, Searchbar } from "@/components/public";
import { Loading } from "@/layout/Loading";
import { useAxios } from "@/hooks/useAxios";

const paymentState = { _id: "", client: "", newValue: "", pay: { completed: false, value: 0, discount: 0 } };
export const BillPage = ({ head, type, data, handleSubmit, paymentData, loading, isSubmitted, error }) => {
   const [searchText, setSearchText] = useState("");
   const [filterResult, setFilterResult] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);
   const [payment, setPayment] = useState(paymentState);

   const {
      data: deleteData,
      loading: dLoading,
      error: dError,
      isSubmitted: dIsSubmitted,
      refetch: dRefetch,
   } = useAxios();

   const navigate = useNavigate();

   useEffect(() => {
      if (!data) return;
      setFilterResult(() => data.filter((item) => item.client.includes(searchText)));
   }, [data, searchText]);

   const handleOpenDialog = (bill) => {
      setOpenDialog((open) => !open);

      if (bill) setPayment(() => ({ newValue: "", ...bill }));
   };

   const handleDelete = async (id) => {
      const confirm = window.confirm("هل انت متاكد من حذف الفاتورة");
      if (!confirm) return;

      const { isSubmitted, error } = await dRefetch("delete", `/bills/delete-bill/${id}?type=${type}`);
      if (isSubmitted && error) return;

      setFilterResult((data) => {
         const newData = data.filter((item) => item._id !== id);
         return newData;
      });
   };

   const handlePayment = async () => {
      if (!payment.newValue) return alert("يجب ادخال المبلغ المراد سداده");

      const { isSubmitted, error } = await handleSubmit(payment);
      if (isSubmitted && error) return;

      const bill = data.find((bill) => bill._id === payment._id);
      setFilterResult((data) => {
         const billIndex = data.findIndex((item) => item._id === payment._id);
         data[billIndex] = {
            ...bill,
            pay: {
               ...bill.pay,
               value: +payment.pay.value + +payment.newValue,
               completed:
                  +payment?.billCost - +payment?.pay.value - +payment?.pay.discount - +payment.newValue <= 0,
            },
         };
         return data;
      });

      setPayment(paymentState);
      setOpenDialog(false);
   };

   return (
      <Card className="bg-transparent shadow-none">
         <Loading isSubmitted={isSubmitted} loading={loading} error={error} message={paymentData} />
         <Loading isSubmitted={dIsSubmitted} loading={dLoading} error={dError} message={deleteData} />

         <Typography variant="h3" color="deep-purple" className="text-center">
            {head}
         </Typography>

         <Searchbar setSearchText={setSearchText} />

         <div
            className={`border-sp rounded-lg px-4 py-2 shadow-sp dark:shadow-none ${
               !filterResult?.length || !data?.length ? "hidden" : ""
            }`}
         >
            {(filterResult || data)?.map(({ _id, client, billCost, pay }, i) => (
               <div
                  className={`flex-between relative py-2 ${i % 2 ? "bg-dimPurple" : ""} ${
                     !billCost ? "!hidden" : ""
                  }`}
                  key={i}
               >
                  <div
                     className={`border-sp absolute -z-10 w-full !border-primary-200 dark:!border-primary-900 ${
                        pay?.completed ? "" : "hidden"
                     }`}
                  />

                  <div className="flex-start">
                     <div className="flex">
                        <IconButton
                           variant="text"
                           color="red"
                           className={`group ${dLoading ? "pointer-events-none" : ""}`}
                           onClick={() => handleDelete(_id)}
                        >
                           <i className="fa fa-times text-xl text-red-500 group-hover:text-red-900" />
                        </IconButton>
                        <IconButton
                           variant="text"
                           color="orange"
                           className="group"
                           onClick={() => navigate(`/bills/update-bill/${_id}`)}
                        >
                           <i className="fa fa-edit text-xl text-orange-500 group-hover:text-orange-900" />
                        </IconButton>
                        <IconButton
                           variant="text"
                           color="green"
                           className="group"
                           onClick={() => handleOpenDialog({ _id, client, billCost, pay })}
                        >
                           <i className="fa fa-money-bill-wave text-xl text-green-500 group-hover:text-green-900" />
                        </IconButton>
                     </div>

                     <Typography variant="h5" className="text-dimWhite dark:text-white">
                        {client}
                     </Typography>
                  </div>
                  <IconButton variant="text" color="white">
                     <i
                        className="fa fa-eye text-xl text-dimWhite dark:text-white"
                        onClick={() => navigate(`/bills/show-bill/${_id}?type=${type}`)}
                     />
                  </IconButton>
               </div>
            ))}
         </div>

         <Typography
            variant="h3"
            color="blue-gray"
            className={!filterResult?.length || !data?.length ? "" : "hidden"}
         >
            لا يوجد نتائج بحث
         </Typography>

         <Dialog
            open={openDialog}
            size="md"
            handler={handleOpenDialog}
            className="max-h-[80vh] overflow-y-auto shadow-sp dark:bg-darkGray"
         >
            <DialogHeader className="block">
               <Typography variant="h3" className="flex-between text-dimWhite">
                  <span>تكلفه الفاتورة:</span>
                  <span>{payment?.billCost}</span>
               </Typography>
               <Typography variant="h3" className="flex-between text-dimWhite">
                  <span>الخصم:</span>
                  <span>{payment?.pay.discount}</span>
               </Typography>
               <Typography variant="h3" className="flex-between text-dimWhite">
                  <span>المبلغ المتبقي:</span>
                  <span>{+payment?.billCost - +payment?.pay.value - +payment?.pay.discount}</span>
               </Typography>
            </DialogHeader>
            <DialogBody>
               <Field
                  type="number"
                  label="المبلغ المرد دفعة"
                  value={payment?.newValue}
                  onChange={(event) => setPayment((payment) => ({ ...payment, newValue: event.target?.value }))}
               />
            </DialogBody>

            <DialogFooter>
               <Button
                  color="deep-purple"
                  className="text-xl hover:brightness-125"
                  fullWidth
                  disabled={loading}
                  onClick={handlePayment}
               >
                  اضافه
               </Button>
            </DialogFooter>
         </Dialog>
      </Card>
   );
};
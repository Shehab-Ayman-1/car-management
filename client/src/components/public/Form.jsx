import { Typography, Button, Card, CardBody, CardHeader, CardFooter } from "@material-tailwind/react";

export const Form = ({
   headerText = "",
   buttonText = "",
   cardStyle = "",
   headerStyle = "",
   bodyStyle = "",
   footerStyle = "",
   loading = false,
   onSubmit = () => {},
   children,
   ...formRest
}) => {
   return (
      <form onSubmit={onSubmit} autoComplete="off" {...formRest}>
         <Card
            className={`dark:border-sp bg-gradient mx-auto mb-2 mt-14 w-[650px] max-w-full    shadow-sp dark:shadow-none md:mt-32 ${cardStyle}`}
         >
            <CardHeader
               variant="gradient"
               color="deep-purple"
               className={`mx-auto -mt-12 mb-4 grid h-20 w-[80%] place-items-center sm:h-28 ${headerStyle || ""}`}
            >
               <Typography variant="h3" className="text-2xl md:text-3xl">
                  {headerText}
               </Typography>
            </CardHeader>

            <CardBody className={`flex flex-col gap-4 p-3 ${bodyStyle}`}>{children}</CardBody>

            {buttonText && (
               <CardFooter className={`p-3 ${footerStyle}`}>
                  <Button
                     type="submit"
                     variant="gradient"
                     disabled={loading}
                     color="deep-purple"
                     className="text-xl hover:brightness-125 md:text-2xl"
                     fullWidth
                  >
                     {buttonText}
                  </Button>
               </CardFooter>
            )}
         </Card>
      </form>
   );
};

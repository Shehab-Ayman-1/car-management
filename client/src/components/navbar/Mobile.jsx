import { Accordion, AccordionBody, AccordionHeader, Drawer, List, ListItem } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { links } from "@/constants/navbar";

export const Mobile = ({ openDrawer, handleDrawer }) => {
   const [openAccordion, setOpenAccordion] = useState(0);

   const handleAccordion = (value) => setOpenAccordion((open) => (open === value ? 0 : value));

   const ChevronIcon = ({ id }) => {
      return <i className={`fa fa-chevron-left ${id === openAccordion ? "-rotate-90 text-white" : ""}`} />;
   };

   return (
      <Drawer className="bg-dimBlack p-4" placement="left" open={openDrawer} onClose={handleDrawer}>
         <i className="fa fa-times text-xl text-dimWhite hover:text-white" onClick={handleDrawer} />

         <List>
            {links.map(({ title, path, paths }, i) =>
               title ? (
                  <Accordion icon={<ChevronIcon id={i + 1} />} open={openAccordion === i + 1} key={i}>
                     <ListItem className="hover:bg-blue-gray-700">
                        <AccordionHeader
                           className={`w-full text-2xl font-bold text-white hover:text-white`}
                           onClick={() => handleAccordion(i + 1)}
                        >
                           {title}
                        </AccordionHeader>
                     </ListItem>

                     <AccordionBody className="py-0">
                        <List className="py-0">
                           {paths.map(({ name, icon, link }, i) =>
                              name ? (
                                 <Link
                                    to={`/${path}/${link}`}
                                    key={i}
                                    className="text-2xl text-blue-gray-600 group-hover:text-white"
                                 >
                                    <ListItem
                                       className="flex-start group text-xl font-bold text-white hover:bg-blue-gray-700 hover:text-white"
                                       onClick={handleDrawer}
                                    >
                                       <i
                                          className={`${icon} text-2xl text-blue-gray-600 group-hover:text-white`}
                                       />
                                       <p className="">{name}</p>
                                    </ListItem>
                                 </Link>
                              ) : null,
                           )}
                        </List>
                     </AccordionBody>
                  </Accordion>
               ) : null,
            )}
         </List>
      </Drawer>
   );
};

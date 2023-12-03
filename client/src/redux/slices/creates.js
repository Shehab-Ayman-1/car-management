import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   categories: [],
   companies: [],
   products: [],
   lists: [],
   searchList: [],
   suppliersLists: [],
   suppliers: [],
};
export const createsSlice = createSlice({
   name: "creates",
   initialState,
   reducers: {
      getLists: (state, { payload }) => {
         state.lists = state.lists.concat(payload);
         state.categories = state.categories.concat(payload.map(({ category }) => category));
         return state;
      },

      getSuppliers: (state, { payload }) => {
         state.suppliersLists = state.suppliersLists.concat(payload);
         state.suppliers = state.suppliers.concat(payload.map(({ supplier }) => supplier));
         return state;
      },

      getSearchList: (state, { payload }) => {
         state.searchList = state.searchList.concat(payload);
         return state;
      },

      filterSelection: (state, { payload }) => {
         if (payload.process === "suppliers") {
            // payload: { process: "", supplier: "" }
            const supplier = state.suppliersLists?.find((list) => list.supplier === payload.supplier);
            if (!supplier) return state;
            state.products = supplier?.products;
            return state;
         }

         // payload: { category: "", company: "" }
         // Categories
         const categories = state.lists?.map((list) => list?.category);
         state.categories = categories;

         // Companies
         const category = state.lists?.find((list) => list?.category === payload?.category);
         const companies = category?.companies?.map(({ company }) => company);
         state.companies = companies;

         // Products
         const company = category?.companies?.find(({ company }) => company === payload?.company);
         state.products = company?.products;

         return state;
      },

      setSuppliers: (state, { payload }) => {
         state.suppliersLists = state.suppliersLists.concat(payload);
         state.suppliers = state.suppliers.concat(payload.supplier);
         return state;
      },

      setCategories: (state, { payload }) => {
         const category = {
            category: payload.category,
            companies: [{ company: payload.company, products: [] }],
         };
         state.lists.push(category);
         state.categories.push(payload.category.trim());
         return state;
      },

      setCompanies: (state, { payload }) => {
         const categoryIndex = state.lists.findIndex((item) => item.category === payload.category);
         if (categoryIndex === -1) return state;

         state.lists[categoryIndex]?.companies.push({ company: payload.company, products: [] });
         return state;
      },

      setProducts: (state, { payload }) => {
         const categoryIndex = state.lists.findIndex((item) => item.category === payload.category);
         if (categoryIndex === -1) return state;

         const companyIndex = state.lists[categoryIndex]?.companies.findIndex(
            ({ company }) => company === payload.company,
         );

         if (companyIndex === -1) return state;
         const productsNames = payload.products.map(({ name }) => name);

         state.lists[categoryIndex]?.companies[companyIndex].products.push(...productsNames);
         return state;
      },
   },
});

export const { getLists, getSuppliers, getSearchList, filterSelection } = createsSlice.actions;
export const { setSuppliers, setCategories, setCompanies, setProducts } = createsSlice.actions;

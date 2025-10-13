import { PricingTable } from "@clerk/nextjs";
import React from "react";
import Header from "../_components/Header";

const Billing = () => {
  return (
    <>
      <Header />
      <section className="mt-20">
        <div>
          <h2 className="text-2xl font-bold text-center mb-3">
            Choose your plan
          </h2>
          <p className=" text-sm text-gray-500 text-center mb-10">
            {" "}
            Export clean, optimized code with accessibility features and
            responsive design built-in
          </p>
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
          <PricingTable />
        </div>
      </section>
    </>
  );
};

export default Billing;

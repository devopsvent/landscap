"use client";

import dynamic from "next/dynamic";

const AddressbarWrapper = dynamic(
	() => import("../components/Dashboard/Home/Addressbar"),
	{ ssr: false },
);

export default AddressbarWrapper;

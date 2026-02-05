"use client";
import React from "react";
import Trees from "@/ui/Tree";
import Canvas from "@/ui/Canvas";
import ImageUpload from "@/ui/ImageUpload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImage } from "@/context/ImageContext";

const AutoMaskImageBox = () => {
	const { setSelectedStyleId, setSelectedImage, setSelectedMaskUrls } =
		useImage();
	const [activeBox, setActiveBox] = useState<number>();
	const router = useRouter();
	const handleBoxClick = (boxNumber: number, path: string) => {
		setActiveBox(boxNumber);
		router.push(path);
		if (path === "/dashboard") {
			setSelectedImage("");
			setSelectedMaskUrls([]);
			setSelectedStyleId(null);
		}
	};

	const boxes = [
		{
			id: 1,
			icon: <Trees />,
			text: "Choose another\nstyle",
			path: "/dashboard/garden-styles",
			className: "box-design-1",
		},
		{
			id: 2,
			icon: <Canvas />,
			text: "Re-imagine\nanother area",
			path: "/dashboard/automask",
			className: "box-design-2",
		},
		{
			id: 3,
			icon: <ImageUpload />,
			text: "Upload New\nimage",
			path: "/dashboard",
			className: "box-design-3",
		},
	];

	return (
		<>
			<div className='overlay-box-container'>
				<div className='align-items-center flex space-x-4'>
					{boxes.map(({ id, icon, text, path, className }) => (
						<div
							key={id}
							role='button'
							tabIndex={0}
							aria-pressed={activeBox === id}
							onClick={() => handleBoxClick(id, path)}
							onKeyDown={(e) =>
								e.key === "Enter" && handleBoxClick(id, path)
							}
							className={`${className} h-9rem w-5 rounded-lg bg-opacity-80 p-3 text-center shadow-md ${
								activeBox === id ? "active-box" : ""
							} hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400`}
						>
							{icon}
							<p className='whitespace-pre-line text-sm'>
								{text}
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default AutoMaskImageBox;

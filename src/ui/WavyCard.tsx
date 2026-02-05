import React from "react";
import Image from "next/image";
import logo from "../assets/landscape_logo.png";
import dummyUser from "../assets/Mask.png";
import { Rating } from "primereact/rating";
import { WavyCardProps } from "@/types";
// import "@/app/globals.css";
import TopWave from "./TopWave";
import "./index.css";
import BottomWave from "./BottomWave";

const WavyCard: React.FC<WavyCardProps> = ({ title, span1, span2 }) => {
	return (
		<div
			className='relative min-h-screen overflow-hidden p-6'
			style={{
				width: "45%",
				backgroundColor: "#004626",
				opacity: "0.8",
			}}
		>
			<div
				className='top-wave absolute top-0'
				style={{ right: "-126px" }}
			>
				<TopWave />
			</div>

			{/* Logo */}
			<div
				style={{
					width: "8rem",
					height: "8rem",
					backgroundColor: "#D9CD82",
					borderRadius: "1.5rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				className='mt-6'
			>
				<Image src={logo} alt='Garden Logo' width={100} height={100} />
			</div>

			{/* Heading */}
			<div style={{ marginTop: "3rem" }}>
				<h1
					style={{
						color: "white",
						fontSize: "3.5rem",
						fontWeight: "bold",
						margin: 0,
						lineHeight: 1.1,
					}}
				>
					{title}
				</h1>
				<h1
					style={{
						fontSize: "3.5rem",
						fontWeight: "bold",
						margin: 0,
						lineHeight: 1.1,
						marginBottom: "1rem",
					}}
				>
					<span style={{ color: "#4AE290" }}>{span1}</span>{" "}
					<span style={{ color: "#FF9D2B" }}>{span2}</span>
				</h1>

				<p
					style={{
						color: "white",
						fontSize: "1.25rem",
						lineHeight: 1.5,
						marginTop: "2rem",
					}}
				>
					<span style={{ color: "#FF9D2B", fontWeight: 500 }}>
						Designed
					</span>{" "}
					for everyone who wants a{" "}
					<span style={{ color: "#4AE290", fontWeight: 500 }}>
						beautiful garden
					</span>{" "}
					<br />
					with a simple tap.
				</p>
			</div>

			{/* Testimonial */}
			<div
				style={{
					backgroundColor: "rgba(0,0,0,0.3)",
					padding: "1.5rem",
					borderRadius: "1rem",
					marginTop: "4rem",
					marginBottom: "2rem",
					maxWidth: "75%",
				}}
			>
				<p
					style={{
						color: "white",
						margin: 0,
						lineHeight: 1.6,
						fontSize: "1rem",
					}}
				>
					Love the experience. Got my yard setup and all necessary
					details in about a month and I barely had to do anything.
					Definitely recommend!
				</p>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginTop: "1rem",
					}}
				>
					<div
						style={{
							width: "3.5rem",
							height: "3.5rem",
							borderRadius: "50%",
							overflow: "hidden",
							border: "3px solid white",
							marginRight: "1rem",
						}}
					>
						<Image
							src={dummyUser}
							alt='Kevin Cooper'
							width={56}
							height={56}
						/>
					</div>
					<span style={{ color: "#FF9D2B", fontWeight: 500 }}>
						Kevin Cooper
					</span>
					<div style={{ marginLeft: "auto" }}>
						<Rating
							value={5}
							readOnly
							stars={5}
							cancel={false}
							color='#FF9D2B'
						/>
					</div>
				</div>
			</div>
			<div className='absolute' style={{ left: "73%", bottom: "-7px" }}>
				<BottomWave />
			</div>
		</div>
	);
};

export default WavyCard;

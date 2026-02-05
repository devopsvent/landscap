import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: false,
	images: {
		domains: [
			"landscape-ai-development-nehal-yard-image-bucket.s3.us-east-2.amazonaws.com",
			"landscape-ai-development-garden-style-bucket.s3.us-east-2.amazonaws.com",
			"landscape-ai-development-nehal-yard-image-bucket.s3.amazonaws.com",
			"d3h3p2b93tioab.cloudfront.net",
		],
	},
};

export default nextConfig;

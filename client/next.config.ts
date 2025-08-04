import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		// Add this for data URLs
		formats: ['image/webp', 'image/avif'],
	},
	// Add runtime configuration for Kubernetes deployment
	publicRuntimeConfig: {
		SERVER_URL: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.creonix.io',
		CUSTOMIZE_COMP: process.env.CUSTOMIZE_COMP || process.env.NEXT_PUBLIC_CUSTOMIZE_COMP || 'Customize Scene',
		RENDER_COMP: process.env.RENDER_COMP || process.env.NEXT_PUBLIC_RENDER_COMP || 'Render',
	},
	// Optional: Also add server runtime config if you need server-side access
	serverRuntimeConfig: {
		SERVER_URL: process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.creonix.io',
	},
};

export default nextConfig;
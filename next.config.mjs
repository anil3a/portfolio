/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '**.githubusercontent.com' },
			{ protocol: 'https', hostname: '**.github.com' }
		],
		unoptimized: true,
	},
	output: 'export',
};

export default nextConfig;

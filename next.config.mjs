/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Web Packのコードの最小化を適用しないことでmysqlモジュールが適切に動くようになる。
        console.log("Disabling webpack minimization for the server-side build.");
            config.optimization.minimize = false;

            return config;
    }
};

export default nextConfig;

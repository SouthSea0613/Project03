import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/component/**/*.{js,ts,jsx,tsx,mdx}', // components 경로 추가
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'background': '#1a202c',
                'primary': '#4299E1',
                'accent': '#9F7AEA',
                'text-main': '#E2E8F0',
                'text-secondary': '#A0AEC0',
                'border': '#2D3748',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
export default config
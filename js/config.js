tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#050505',
                    card: '#0F0F0F',
                    border: '#1F1F1F',
                    blue: '#007BFF', // Electric Blue
                    cyan: '#00F0FF', // Neon Cyan
                    green: '#00FF94', // Neon Green
                    purple: '#9D00FF',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'neon-gradient': 'linear-gradient(135deg, #007BFF 0%, #00F0FF 100%)',
                'dark-gradient': 'linear-gradient(to bottom, #050505, #0a0a0a)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    }
}
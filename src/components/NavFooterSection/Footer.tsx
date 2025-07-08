import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 pt-12 pb-20 md:pb-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Logo */}
                        <Link href="/">
                            <div className="flex items-center w-full space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="logo"
                                        title="logo"
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Snap Card
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Stay updated!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            />
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p>English</p>
                                <p>© 2025 Snap Card</p>

                                <div className="flex space-x-4">
                                    {/* X (Twitter) Icon */}
                                    <div className="relative group">
                                        <a
                                            href="https://x.com/ObayomiTaofeek"
                                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                            aria-label="X (Twitter)"
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                            >
                                                <path
                                                    d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </a>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                            X (Twitter)
                                        </span>
                                    </div>

                                    {/* GitHub Icon */}
                                    <div className="relative group">
                                        <a
                                            href="https://github.com/Tobless-scripts?tab=repositories"
                                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                            aria-label="GitHub"
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.195 22 16.418 22 12.017 22 6.484 17.522 2 12 2z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </a>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                            GitHub
                                        </span>
                                    </div>

                                    {/* LinkedIn Icon */}
                                    <div className="relative group">
                                        <a
                                            href="https://www.linkedin.com/in/obayomi-taofeek-805a56267/"
                                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                            aria-label="LinkedIn"
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                            >
                                                <path
                                                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </a>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                            LinkedIn
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

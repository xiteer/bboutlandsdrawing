import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center gap-6 text-sm">
          <Link
            href="/rigged"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            OMG Rigged!?
          </Link>
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h1 className="text-2xl font-bold">BelajarBahasaInggris</h1>
            <p className="text-gray-400 text-base">
              Platform belajar bahasa Inggris online terlengkap untuk pemula hingga mahir.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Navigasi
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/learn" className="text-base text-gray-300 hover:text-white">
                      Modul Pembelajaran
                    </a>
                  </li>
                  <li>
                    <a href="/quiz" className="text-base text-gray-300 hover:text-white">
                      Quiz
                    </a>
                  </li>
                  <li>
                    <a href="/dictionary" className="text-base text-gray-300 hover:text-white">
                      Kamus
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Level
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/learn/a1" className="text-base text-gray-300 hover:text-white">
                      A1 - Pemula
                    </a>
                  </li>
                  <li>
                    <a href="/learn/a2" className="text-base text-gray-300 hover:text-white">
                      A2 - Dasar
                    </a>
                  </li>
                  <li>
                    <a href="/learn/b1" className="text-base text-gray-300 hover:text-white">
                      B1 - Menengah
                    </a>
                  </li>
                  <li>
                    <a href="/learn/b2" className="text-base text-gray-300 hover:text-white">
                      B2 - Menengah Atas
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Kontak
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="mailto:info@belajarbahasainggrismudah.com" className="text-base text-gray-300 hover:text-white">
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} BelajarBahasaInggris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

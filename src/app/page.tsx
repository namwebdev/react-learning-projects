import { Navbar } from '@/components/Navbar'
import { Image as ImageIcon } from 'lucide-react'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-default-50">
      {/* Use the unified Navbar component */}
      <Navbar />

      <main className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-default-900 leading-tight">
                    Store your <span className="text-primary">images</span> with
                    ease
                  </h1>
                  <p className="text-lg md:text-xl text-default-600">
                    Simple. Secure. Fast.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                  {/* <SignedOut>
                    <Link href="/sign-up">
                      <Button size="lg" variant="solid" color="primary">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" variant="flat" color="primary">
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        endContent={<ArrowRight className="h-4 w-4" />}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn> */}
                </div>
              </div>

              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-24 md:h-32 w-24 md:w-32 text-primary/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
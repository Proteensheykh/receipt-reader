import PDFDropZone from "@/components/PDFDropZone";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2Icon, Check, Search, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section>
        <div className="container px-4 md">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Intelligent Receipt Processing</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">Process receipts automatically and save time with our intelligent receipt processing system.
              </p>
            </div>

            <div className="space-x-4">
              <Link href="/receipts">
                <Button className="bg-blue-500 hover:bg-blue-600">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
              <Link href="#features">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Drop zone for PDF(Receipts) */}
        <div className="mt-12 p-12 flex justify-center">
          <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-gray-800 dark:bg-gray-950">
            <div className="p-6 md:p-8 relative">
              <PDFDropZone />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">Features</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Our AI-powered platform transforms how you handle receipts and track expenses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 md:p-6 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Easy Uploads</h3>
                <p className="text-gray-500 dark:text-gray-400">Drag and drop your PDF(Receipt) here for instant scanning and processing.
                
                </p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 md:p-6 rounded-full bg-green-100 dark:bg-green-900">
                  <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400">Automatically analyzes your receipts and extracts relevant information with intelligent AI.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 md:p-6 rounded-full bg-purple-100 dark:bg-purple-900">
                  <BarChart2Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Expense Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">Generate reports and gain valuable insights from your income/expense patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">Simple Pricing</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Choose a plan that works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mx-auto max-w-5xl">
              {/* Free Tier */}
              <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-950 dark:border-gray-800">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-gray-500 dark:text-gray-400">The free tier all to try.</p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold">$0.00</p>
                  <p className="text-gray-500 dark:text-gray-400">/month</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>2 scans per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Basic data extraction</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>7-day history</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full" variant="outline">Get Started for free</Button>
                  </Link>
                </div>
              </div>
              {/* Starter Tier */}
              <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-950 dark:border-gray-800">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <p className="text-gray-500 dark:text-gray-400">A taste of expensing goodness.</p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold">$4.99</p>
                  <p className="text-gray-500 dark:text-gray-400">/month</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>50 scans per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Enhanced data extraction</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>30-day history</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Basic export Options</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full" variant="outline">Choose Plan</Button>
                  </Link>
                </div>
              </div>
              {/* Pro Tier */}
              <div className="relative flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-950 dark:border-gray-800">
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-gray-500 dark:text-gray-400">For teams and businesses.</p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold">$9.99</p>
                  <p className="text-gray-500 dark:text-gray-400">/month</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>300 scans per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Advanced AI data extraction</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>AI Summaries</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Unlimited history</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Advanced export Options</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full" variant="outline">Choose Plan</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section id="info" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">Start Scanning Today</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join thousands of users who save time and gain insights from their receipts.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            <div>
              <p>&copy; {new Date().getFullYear()} Reseet. All rights reserved.</p>
            </div>
            <div>
              <p>Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

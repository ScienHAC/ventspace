import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Leaf } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Leaf className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Oops! Page not found</h2>

        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the forest. Don't worry, we'll help you find your way back to your mental
          health journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/chat">
            <Button variant="outline" className="border-green-200 hover:border-green-300 hover:bg-green-50">
              Start Venting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

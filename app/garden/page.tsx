"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, TreePine, Sprout, Award, Share2, Download } from "lucide-react"
import Link from "next/link"

interface Tree {
  id: string
  type: "sapling" | "young" | "mature"
  plantedDate: Date
  ventCount: number
  location: string
}

export default function GardenPage() {
  const [trees, setTrees] = useState<Tree[]>([])
  const [totalImpact, setTotalImpact] = useState({
    co2Absorbed: 0,
    oxygenProduced: 0,
    biodiversitySupported: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGardenData()
  }, [])

  const fetchGardenData = async () => {
    try {
      const response = await fetch("/api/garden")
      const data = await response.json()

      // Convert date strings to Date objects
      const treesWithDates = data.trees.map((tree: any) => ({
        ...tree,
        plantedDate: new Date(tree.plantedDate),
      }))

      setTrees(treesWithDates)
      setTotalImpact(data.impact)
    } catch (error) {
      console.error("Error fetching garden data:", error)
      // Fallback to default data - dates are already Date objects here
      setTrees([
        {
          id: "1",
          type: "mature",
          plantedDate: new Date("2024-05-15"),
          ventCount: 10,
          location: "Amazon Rainforest, Brazil",
        },
        {
          id: "2",
          type: "young",
          plantedDate: new Date("2024-05-25"),
          ventCount: 10,
          location: "Pacific Northwest, USA",
        },
        {
          id: "3",
          type: "sapling",
          plantedDate: new Date("2024-06-05"),
          ventCount: 7,
          location: "Growing...",
        },
      ])
      setTotalImpact({
        co2Absorbed: 156.7,
        oxygenProduced: 234.5,
        biodiversitySupported: 47,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTreeIcon = (type: string) => {
    switch (type) {
      case "mature":
        return <TreePine className="w-12 h-12 text-green-700" />
      case "young":
        return <TreePine className="w-10 h-10 text-green-600" />
      case "sapling":
        return <Sprout className="w-8 h-8 text-green-500" />
      default:
        return <Leaf className="w-6 h-6 text-green-400" />
    }
  }

  const getTreeHeight = (type: string) => {
    switch (type) {
      case "mature":
        return "h-32"
      case "young":
        return "h-24"
      case "sapling":
        return "h-16"
      default:
        return "h-8"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your garden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VentSpace Garden
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Continue Venting
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Impact Summary */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Virtual Garden 🌳
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Every tree represents real environmental impact from your venting journey
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalImpact.co2Absorbed} kg</div>
              <div className="text-sm text-gray-600">CO₂ Absorbed Annually</div>
            </Card>
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalImpact.oxygenProduced} kg</div>
              <div className="text-sm text-gray-600">Oxygen Produced Annually</div>
            </Card>
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">{totalImpact.biodiversitySupported}</div>
              <div className="text-sm text-gray-600">Species Supported</div>
            </Card>
          </div>
        </div>

        {/* Virtual Garden Visualization */}
        <Card className="p-8 mb-8 bg-gradient-to-b from-sky-100 to-green-100 border-green-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Forest</h2>

          <div className="relative h-64 bg-gradient-to-t from-green-200 to-sky-200 rounded-2xl overflow-hidden">
            {/* Sky */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-200 to-blue-100"></div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-300 to-green-200"></div>

            {/* Trees */}
            <div className="absolute bottom-8 left-0 w-full flex items-end justify-center space-x-8">
              {trees.map((tree, index) => (
                <div key={tree.id} className="flex flex-col items-center group cursor-pointer">
                  <div
                    className={`${getTreeHeight(tree.type)} flex items-end justify-center transition-transform group-hover:scale-110`}
                  >
                    {getTreeIcon(tree.type)}
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="bg-white/90 text-green-800 text-xs">Tree #{index + 1}</Badge>
                  </div>
                </div>
              ))}

              {/* Next tree placeholder */}
              <div className="flex flex-col items-center opacity-50">
                <div className="h-12 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-dashed border-green-400 rounded-full flex items-center justify-center">
                    <Sprout className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <Badge className="mt-2 bg-green-100 text-green-600 text-xs">3 vents to go!</Badge>
              </div>
            </div>

            {/* Clouds */}
            <div className="absolute top-4 left-8 w-16 h-8 bg-white/70 rounded-full opacity-80"></div>
            <div className="absolute top-8 right-12 w-12 h-6 bg-white/60 rounded-full opacity-70"></div>
          </div>
        </Card>

        {/* Tree Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {trees.map((tree, index) => (
            <Card
              key={tree.id}
              className="p-6 bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTreeIcon(tree.type)}
                  <div>
                    <h3 className="font-semibold text-gray-800">Tree #{index + 1}</h3>
                    <Badge
                      className={`${
                        tree.type === "mature"
                          ? "bg-green-100 text-green-800"
                          : tree.type === "young"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tree.type}
                    </Badge>
                  </div>
                </div>
                <Award className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Planted:</span>
                  <span>{tree.plantedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>From vents:</span>
                  <span>{tree.ventCount} messages</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-right">{tree.location}</span>
                </div>
              </div>

              {tree.type === "sapling" && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-700 mb-1">Growth Progress</div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(tree.ventCount / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">{10 - tree.ventCount} more vents to mature</div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Achievement Section */}
        <Card className="p-8 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Environmental Achievements 🏆
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <TreePine className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Forest Guardian</h3>
                <p className="text-sm text-gray-600">Planted your first tree</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Eco Warrior</h3>
                <p className="text-sm text-gray-600">3 trees and counting</p>
              </div>

              <div className="flex flex-col items-center opacity-50">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Climate Champion</h3>
                <p className="text-sm text-gray-600">Plant 10 trees (7 to go!)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Share Section */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Share Your Impact</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Share2 className="w-5 h-5 mr-2" />
              Share Garden
            </Button>
            <Button variant="outline" className="border-green-200 hover:border-green-300 hover:bg-green-50">
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

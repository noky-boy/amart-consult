import { Card, CardContent } from "@/components/ui/card"

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="h-[70vh] bg-gray-200 animate-pulse relative">
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex gap-4 mb-4">
            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="h-12 w-96 bg-gray-300 rounded animate-pulse mb-4" />
          <div className="flex gap-6">
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-28 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Project Overview Skeleton */}
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Challenge & Solution Skeleton */}
            <div>
              <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Gallery Skeleton */}
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center p-4 bg-gray-100 rounded-lg">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

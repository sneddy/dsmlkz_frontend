export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00AEC7] mx-auto mb-4"></div>
        <p className="text-gray-300">Loading job details...</p>
      </div>
    </div>
  )
}

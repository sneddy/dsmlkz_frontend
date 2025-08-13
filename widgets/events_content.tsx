const EventsContent = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">Upcoming Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Event Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/images/announce_horizontal.png" alt="Event Announcement" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Tech Conference 2024</h3>
              <p className="text-gray-700">
                Join us for the premier tech conference of the year! Learn about the latest trends and network with
                industry leaders.
              </p>
              <p className="text-gray-600 mt-2">Date: October 26-28, 2024</p>
              <p className="text-gray-600">Location: San Francisco, CA</p>
              <a
                href="#"
                className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Register Now
              </a>
            </div>
          </div>

          {/* Event Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/images/workshop.jpg" alt="Workshop" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">AI Workshop for Beginners</h3>
              <p className="text-gray-700">
                A hands-on workshop to introduce you to the world of Artificial Intelligence. No prior experience
                required!
              </p>
              <p className="text-gray-600 mt-2">Date: November 15, 2024</p>
              <p className="text-gray-600">Location: New York, NY</p>
              <a
                href="#"
                className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Event Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/images/meetup.jpg" alt="Meetup" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Blockchain Meetup</h3>
              <p className="text-gray-700">
                Connect with fellow blockchain enthusiasts and discuss the future of decentralized technologies.
              </p>
              <p className="text-gray-600 mt-2">Date: December 5, 2024</p>
              <p className="text-gray-600">Location: London, UK</p>
              <a
                href="#"
                className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Join the Meetup
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsContent

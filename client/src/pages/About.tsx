const About = () => {
  return (
    <div className="w-full bg-edge-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-edge-black uppercase mb-6">
              About <span className="text-edge-red text-transparent bg-clip-text bg-gradient-to-r from-edge-red to-red-600">Us</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              Edge was formed out of the desire to bring creative, logistical and branding know-how to the market.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase text-edge-black">
                Why Edge Productions?
              </h2>
              <ul className="space-y-6 text-gray-500 font-light leading-relaxed">
                  <li>
                    <strong className="text-edge-black font-bold">‘EDGE’</strong> means ‘excessive sharpness' and we do take sincere pride in working “edge to edge.”
                  </li>
                  <li>
                    From fresh creative concepts to intricate logistical execution, we create and manage dynamic, memorable and effective events of all magnitude.
                  </li>
                  <li>
                    ‘Edge Productions’ has been proud to execute events for the world’s greatest brands on both a national and international level.
                  </li>
                  <li>
                    A positive work environment and quality relationships with both clients and vendors are key to the company's success.
                  </li>
              </ul>
            </div>
            <div className="relative h-[500px] bg-edge-gray w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" alt="Edge Productions Events" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-edge-black/80 to-transparent"></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;

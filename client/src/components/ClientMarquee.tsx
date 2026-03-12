const clients = [
  'PANASONIC',
  'VIDEOCON',
  'SHELL',
  'MICROSOFT',
  'HSBC',
  'INDIAN EXPRESS',
  'ET NOW',
  'BLOOMBERG UTV',
  'NDTV GOOD TIMES',
  'NAUKRI.COM',
  'BAJAJ PLATINI',
  'HAIER',
  'WIZCRAFT'
];

const ClientMarquee = () => {
  return (
    <div className="bg-edge-black text-edge-white py-12 overflow-hidden border-y border-gray-900 shadow-2xl relative">
      {/* Decorative gradients for fading edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-edge-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-edge-black to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Duplicate the array twice to ensure a seamless infinite loop */}
        {[...clients, ...clients, ...clients].map((client, index) => (
          <div 
            key={index}
            className="inline-flex items-center mx-12 opacity-50 hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-3xl md:text-5xl font-black tracking-widest text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)' }}>
               {client}
            </span>
            <div className="w-2 h-2 rounded-full bg-edge-red mx-12 opacity-50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientMarquee;

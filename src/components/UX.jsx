export const UX = () => {
   return (
      <main className="w-screen">
         <Section className="flex flex-col items-center justify-center">
            <h1
               className=" text-4xl md:text-8xl font-light text-center text-transparent
        bg-clip-text bg-gradient-to-r  from-gray-100/50 via-white to-gray-100/50 drop-shadow-sm"
            >
               Welcome to the Starry Earth Scene
            </h1>
            <p className="text-center text-white/90 mt-10 text-sm">
               hero section with the Earth and a starry background! 🌍✨
            </p>
            <button className="mt-10 px-8 py-2 bg-white text-black rounded-full text-sm hover:bg-white/30 hover:text-white cursor-pointer transition-colors duration-300">
               Mr_vji
            </button>
         </Section>
      </main>
   );
};

const Section = ({ children, className = "" }) => {
   return (
      <section className={`max-w-[1024px] mx-auto h-screen p-10 ${className}`}>
         {children}
      </section>
   );
};

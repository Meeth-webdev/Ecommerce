'use client';

export default function ShuffleDeck() {
  return (
    <section className="bg-gray-900 min-h-screen flex justify-center items-center text-white px-4">
      <div className="flex flex-wrap lg:flex-nowrap gap-8 justify-center items-center max-w-[1100px] w-full">
        {[
          {
            img: "/images/games/ac-mirage-1.jpg",
            title: "Assassin's Creed Mirage",
            highlights: `Return to Classic Stealth, Black Box Missions, Assassin Focus, Enhanced Parkour.`,
            description: `Return to Classic Stealth: The game emphasizes stealth, parkour, and assassinations, reminiscent of earlier Assassin's Creed titles.

Black Box Missions: Players can explore environments to find different ways to reach and eliminate their targets.

Assassin Focus: A new ability allowing players to eliminate multiple enemies simultaneously.

Enhanced Parkour: Movement and running animations have been refined to improve fluidity.`,
          },
          {
            img: "/images/games/gow-ragnarok-1.jpg",
            title: "GOW RAGNAROK",
            highlights: `Seamless Combat, Expanded Realms, Atreus Gameplay, Mythical Boss Fights.`,
            description: `Seamless Combat with Leviathan Axe and Runic attacks.

Explore all Nine Realms including Vanaheim, Svartalfheim, and Asgard.

Atreus is more capable with new powers and AI improvements.

Face Norse gods like Thor and Odin in cinematic boss battles.`,
          },
          {
            img: "/images/games/re4-remake-1.jpg",
            title: "Resident Evil 4",
            highlights: `Modern Combat, Knife Parry, Stealth, Smarter Enemies.`,
            description: `Built with the RE Engine for photorealism.

Improved enemy AI and new stealth mechanics.

Knife parry system even for chainsaw attacks.

Better companion AI with Ashley and varied tactical combat.`,
          },
          {
            img: "/images/games/rdr2-1.jpg",
            title: "RDR-2",
            highlights: `Immersive World, Honor System, Realistic Horses, Cinematic Story.`,
            description: `Expansive open world with dynamic weather and wildlife.

Moral choices affect reputation and honor system.

Horse bonding mechanics impact handling.

In-depth crafting, gunplay, and storytelling.`,
          },
        ].map((game, idx) => (
          <div
            key={idx}
            className="relative w-[300px] h-[420px] sm:w-[340px] sm:h-[460px] transition-transform duration-1000 transform-style-preserve-3d hover:[transform:rotateY(180deg)]"
          >
            {/* Front Side */}
            <div className="absolute w-full h-full [backface-visibility:hidden]">
              <img src={game.img} alt={game.title} className="w-full h-full  " />
            </div>

            {/* Back Side */}
            <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gray-100 text-gray-800 rounded-xl overflow-hidden">
              <div className="flex flex-col justify-center items-center h-full px-4 pb-4 text-center overflow-y-auto">
                <h1 className="text-xl font-bold">{game.title}</h1>
                <p className="my-2 text-[16px] font-semibold">Gameplay Highlights</p>
                <p className="text-[12px] whitespace-pre-line">{game.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
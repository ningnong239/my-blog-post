import authorImage from "../assets/ning.jpg";
import ntLogo from "../assets/NT.png";

export function HeroSection() {
  return (
    <main className="container md:px-8 px-4 py-8 lg:py-16 mx-auto">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Dev, <br className="hidden lg:block" />
           Life Style, <br />
           General,
          </h1>
          <p className="text-lg text-muted-foreground">
            My blog is a platform for me to share my thoughts and experiences on various topics.
          </p>
        </div>
        <img
          src={ntLogo}
          alt="NT Logo"
          className="h-[530px] object-cover rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0"
        />
        <div className="lg:w-1/3 lg:pl-8">
          <h2 className="text-xl font-semibold mb-2">-Author</h2>
          <h3 className="text-2xl font-bold mb-4">Naiyana T.</h3>
          <p className="text-muted-foreground mb-4">
          👨‍💻 I'm a developer who loves coding, cooking, and creativity.<br /><br />
          🍳 When I'm not debugging, you'll probably find me experimenting in the kitchen.<br /><br />
          🎬 Movies and games are my favorite ways to unwind and get inspired.
          </p>
          <p className="text-muted-foreground">
          When I'm not coding, I love cooking, watching movies, and playing games.
          </p>
        </div>
      </div>
    </main>
  );
}

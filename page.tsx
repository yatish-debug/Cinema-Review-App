import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { summarizeReview } from "@/ai/flows/summarize-review";
import { Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Movie interface
interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  description: string;
  actorImageUrl: string;
  actors: { name: string; budget: number; grossEarnings: number }[];
}

// Static movie data (replace with a more robust data source if needed)
const initialMovies: Movie[] = [
  { id: 1, title: "Dilwale Dulhania Le Jayenge", genre: "Romance", rating: 9.5, imageUrl: "https://picsum.photos/id/1025/200/300", description: "A classic Bollywood romance about two lovers and their journey to be together.", actorImageUrl: "https://picsum.photos/id/678/50/50", actors: [{ name: "Shah Rukh Khan", budget: 20000000, grossEarnings: 200000000 }, { name: "Kajol", budget: 15000000, grossEarnings: 150000000 }] },
  { id: 2, title: "Bahubali: The Beginning", genre: "Action", rating: 8.9, imageUrl: "https://picsum.photos/id/1026/200/300", description: "An epic South Indian action film about warring factions and a hidden prince.", actorImageUrl: "https://picsum.photos/id/679/50/50", actors: [{ name: "Prabhas", budget: 18000000, grossEarnings: 180000000 }, { name: "Rana Daggubati", budget: 12000000, grossEarnings: 120000000 }] },
  { id: 3, title: "The Shawshank Redemption", genre: "Drama", rating: 9.3, imageUrl: "https://picsum.photos/id/1027/200/300", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", actorImageUrl: "https://picsum.photos/id/680/50/50", actors: [{ name: "Tim Robbins", budget: 22000000, grossEarnings: 220000000 }, { name: "Morgan Freeman", budget: 17000000, grossEarnings: 170000000 }] },
  { id: 4, title: "3 Idiots", genre: "Comedy", rating: 9.1, imageUrl: "https://picsum.photos/id/1028/200/300", description: "Two friends are searching for their long lost companion. Along the way, they recount their college memories that inspired them to think differently, even as the rest of the world called them 'idiots'.", actorImageUrl: "https://picsum.photos/id/681/50/50", actors: [{ name: "Aamir Khan", budget: 21000000, grossEarnings: 210000000 }, { name: "Sharman Joshi", budget: 16000000, grossEarnings: 160000000 }] },
  { id: 5, title: "Sita Ramam", genre: "Romance", rating: 8.6, imageUrl: "https://picsum.photos/id/1029/200/300", description: "In 1965, a soldier stationed in Kashmir receives anonymous love letters from a woman named Sita. Intrigued, he sets out to find her.", actorImageUrl: "https://picsum.photos/id/682/50/50", actors: [{ name: "Dulquer Salmaan", budget: 19000000, grossEarnings: 190000000 }, { name: "Mrunal Thakur", budget: 14000000, grossEarnings: 140000000 }] },
  { id: 6, title: "Inception", genre: "Sci-Fi", rating: 8.8, imageUrl: "https://picsum.photos/id/1030/200/300", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.", actorImageUrl: "https://picsum.photos/id/683/50/50", actors: [{ name: "Leonardo DiCaprio", budget: 23000000, grossEarnings: 230000000 }, { name: "Joseph Gordon-Levitt", budget: 18000000, grossEarnings: 180000000 }] },
  { id: 7, title: "Sholay", genre: "Action", rating: 9.0, imageUrl: "https://picsum.photos/id/1031/200/300", description: "A retired police officer hires two convicts to capture a ruthless dacoit.", actorImageUrl: "https://picsum.photos/id/684/50/50", actors: [{ name: "Amitabh Bachchan", budget: 20500000, grossEarnings: 205000000 }, { name: "Dharmendra", budget: 15500000, grossEarnings: 155000000 }] },
  { id: 8, title: "K.G.F: Chapter 1", genre: "Action", rating: 8.7, imageUrl: "https://picsum.photos/id/1032/200/300", description: "In the 1970s, a young man rises as a kingpin in the Bombay underworld, and later sets out to seek his fortune and acquire power in the Kolar Gold Fields.", actorImageUrl: "https://picsum.photos/id/685/50/50", actors: [{ name: "Yash", budget: 19500000, grossEarnings: 195000000 }, { name: "Srinidhi Shetty", budget: 14500000, grossEarnings: 145000000 }] },
  { id: 9, title: "The Dark Knight", genre: "Action", rating: 9.0, imageUrl: "https://picsum.photos/id/1033/200/300", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", actorImageUrl: "https://picsum.photos/id/686/50/50", actors: [{ name: "Christian Bale", budget: 21500000, grossEarnings: 215000000 }, { name: "Heath Ledger", budget: 16500000, grossEarnings: 165000000 }] },
  { id: 10, title: "Queen", genre: "Comedy", rating: 8.5, imageUrl: "https://picsum.photos/id/1034/200/300", description: "A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets cancelled.", actorImageUrl: "https://picsum.photos/id/687/50/50", actors: [{ name: "Kangana Ranaut", budget: 18500000, grossEarnings: 185000000 }, { name: "Lisa Haydon", budget: 13500000, grossEarnings: 135000000 }] },
  { id: 11, title: "Gentleman", genre: "Action", rating: 8.2, imageUrl: "https://picsum.photos/id/1035/200/300", description: "A vigilante group exacts revenge on corrupt individuals in society.", actorImageUrl: "https://picsum.photos/id/688/50/50", actors: [{ name: "Arjun Sarja", budget: 17500000, grossEarnings: 175000000 }, { name: "Madhubala", budget: 12500000, grossEarnings: 125000000 }] },
  { id: 12, title: "Pulp Fiction", genre: "Crime", rating: 8.9, imageUrl: "https://picsum.photos/id/1036/200/300", description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", actorImageUrl: "https://picsum.photos/id/689/50/50", actors: [{ name: "John Travolta", budget: 20500000, grossEarnings: 205000000 }, { name: "Uma Thurman", budget: 15500000, grossEarnings: 155000000 }] },
  { id: 13, title: "Zindagi Na Milegi Dobara", genre: "Drama", rating: 8.7, imageUrl: "https://picsum.photos/id/1037/200/300", description: "Three friends decide to turn their fantasy vacation into reality after one of them gets engaged.", actorImageUrl: "https://picsum.photos/id/690/50/50", actors: [{ name: "Hrithik Roshan", budget: 19500000, grossEarnings: 195000000 }, { name: "Farhan Akhtar", budget: 14500000, grossEarnings: 145000000 }] },
  { id: 14, title: "Rangasthalam", genre: "Drama", rating: 8.4, imageUrl: "https://picsum.photos/id/1038/200/300", description: "Chitti Babu, a partially deaf young man, begins to suspect the village president's evil plans after his brother is murdered.", actorImageUrl: "https://picsum.photos/id/691/50/50", actors: [{ name: "Ram Charan", budget: 18000000, grossEarnings: 180000000 }, { name: "Samantha Ruth Prabhu", budget: 13000000, grossEarnings: 130000000 }] },
  { id: 15, title: "The Lord of the Rings", genre: "Fantasy", rating: 9.1, imageUrl: "https://picsum.photos/id/1039/200/300", description: "A young hobbit is entrusted with a powerful ring and a perilous quest to destroy it in the fires of Mount Doom.", actorImageUrl: "https://picsum.photos/id/692/50/50", actors: [{ name: "Elijah Wood", budget: 21000000, grossEarnings: 210000000 }, { name: "Ian McKellen", budget: 16000000, grossEarnings: 160000000 }] },
  { id: 16, title: "Yeh Jawaani Hai Deewani", genre: "Romance", rating: 8.3, imageUrl: "https://picsum.photos/id/1040/200/300", description: "A coming-of-age story about the importance of striking a balance between career ambitions and personal relationships.", actorImageUrl: "https://picsum.photos/id/693/50/50", actors: [{ name: "Ranbir Kapoor", budget: 17000000, grossEarnings: 170000000 }, { name: "Deepika Padukone", budget: 12000000, grossEarnings: 120000000 }] },
  { id: 17, title: "Vikram", genre: "Action", rating: 8.8, imageUrl: "https://picsum.photos/id/1041/200/300", description: "A special investigator is assigned a case of serial killings, only to discover a complex web of mysteries and conspiracies.", actorImageUrl: "https://picsum.photos/id/694/50/50", actors: [{ name: "Kamal Haasan", budget: 20000000, grossEarnings: 200000000 }, { name: "Vijay Sethupathi", budget: 15000000, grossEarnings: 150000000 }] },
  { id: 18, title: "Forrest Gump", genre: "Drama", rating: 9.2, imageUrl: "https://picsum.photos/id/1042/200/300", description: "Forrest Gump, a man with a low IQ, recounts the early years of his life, during which he found himself in the middle of key historical events.", actorImageUrl: "https://picsum.photos/id/695/50/50", actors: [{ name: "Tom Hanks", budget: 22000000, grossEarnings: 220000000 }, { name: "Robin Wright", budget: 17000000, grossEarnings: 170000000 }] },
  { id: 19, title: "Chennai Express", genre: "Comedy", rating: 7.9, imageUrl: "https://picsum.photos/id/1043/200/300", description: "A man reluctantly embarks on a journey to fulfill his grandfather's last wish, only to find love along the way.", actorImageUrl: "https://picsum.photos/id/696/50/50", actors: [{ name: "Shah Rukh Khan", budget: 16000000, grossEarnings: 160000000 }, { name: "Deepika Padukone", budget: 11000000, grossEarnings: 110000000 }] },
  { id: 20, title: "Baahubali 2: The Conclusion", genre: "Action", rating: 9.2, imageUrl: "https://picsum.photos/id/1044/200/300", description: "The epic conclusion of the Baahubali saga, where secrets are revealed and destinies are fulfilled.", actorImageUrl: "https://picsum.photos/id/697/50/50", actors: [{ name: "Prabhas", budget: 23000000, grossEarnings: 230000000 }, { name: "Rana Daggubati", budget: 18000000, grossEarnings: 180000000 }] },
  { id: 21, title: "The Matrix", genre: "Sci-Fi", rating: 8.7, imageUrl: "https://picsum.photos/id/1045/200/300", description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", actorImageUrl: "https://picsum.photos/id/698/50/50", actors: [{ name: "Keanu Reeves", budget: 19000000, grossEarnings: 190000000 }, { name: "Laurence Fishburne", budget: 14000000, grossEarnings: 140000000 }] },
  { id: 22, title: "PK", genre: "Comedy", rating: 8.1, imageUrl: "https://picsum.photos/id/1046/200/300", description: "An alien lands on Earth and befriends a journalist, leading them on a journey to find the true meaning of religion.", actorImageUrl: "https://picsum.photos/id/699/50/50", actors: [{ name: "Aamir Khan", budget: 16000000, grossEarnings: 160000000 }, { name: "Anushka Sharma", budget: 11000000, grossEarnings: 110000000 }] },
  { id: 23, title: "Athadu", genre: "Action", rating: 8.0, imageUrl: "https://picsum.photos/id/1047/200/300", description: "A professional killer is hired to assassinate a politician, but circumstances lead him to assume a false identity.", actorImageUrl: "https://picsum.photos/id/700/50/50", actors: [{ name: "Mahesh Babu", budget: 15000000, grossEarnings: 150000000 }, { name: "Trisha Krishnan", budget: 10000000, grossEarnings: 100000000 }] },
  { id: 24, title: "Interstellar", genre: "Sci-Fi", rating: 8.6, imageUrl: "https://picsum.photos/id/1048/200/300", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", actorImageUrl: "https://picsum.photos/id/701/50/50", actors: [{ name: "Matthew McConaughey", budget: 18000000, grossEarnings: 180000000 }, { name: "Anne Hathaway", budget: 13000000, grossEarnings: 130000000 }] },
  { id: 25, title: "Veer-Zaara", genre: "Romance", rating: 8.4, imageUrl: "https://picsum.photos/id/1049/200/300", description: "An Indian Air Force officer and a Pakistani woman share a deep and profound love that transcends borders.", actorImageUrl: "https://picsum.photos/id/702/50/50", actors: [{ name: "Shah Rukh Khan", budget: 17000000, grossEarnings: 170000000 }, { name: "Preity Zinta", budget: 12000000, grossEarnings: 120000000 }] },
  { id: 26, title: "Magadheera", genre: "Fantasy", rating: 8.3, imageUrl: "https://picsum.photos/id/1050/200/300", description: "A warrior and a princess, separated by fate, are reborn centuries later to fulfill their intertwined destiny.", actorImageUrl: "https://picsum.photos/id/703/50/50", actors: [{ name: "Ram Charan", budget: 16000000, grossEarnings: 160000000 }, { name: "Kajal Aggarwal", budget: 11000000, grossEarnings: 110000000 }] },
  { id: 27, title: "Gladiator", genre: "Action", rating: 8.5, imageUrl: "https://picsum.photos/id/1051/200/300", description: "A Roman General is betrayed and his family murdered by an ambitious emperor. He is forced into slavery and rises through the ranks as a gladiator.", actorImageUrl: "https://picsum.photos/id/704/50/50", actors: [{ name: "Russell Crowe", budget: 18000000, grossEarnings: 180000000 }, { name: "Joaquin Phoenix", budget: 13000000, grossEarnings: 130000000 }] },
  { id: 28, title: "Swades", genre: "Drama", rating: 8.2, imageUrl: "https://picsum.photos/id/1052/200/300", description: "An NRI returns to his homeland and rediscovers his roots, dedicating himself to the betterment of his village.", actorImageUrl: "https://picsum.photos/id/705/50/50", actors: [{ name: "Shah Rukh Khan", budget: 15000000, grossEarnings: 150000000 }, { name: "Gayatri Joshi", budget: 10000000, grossEarnings: 100000000 }] },
  { id: 29, title: "Ratsasan", genre: "Thriller", rating: 8.9, imageUrl: "https://picsum.photos/id/1053/200/300", description: "A rookie police officer attempts to track down a serial killer who targets schoolgirls.", actorImageUrl: "https://picsum.photos/id/706/50/50", actors: [{ name: "Vishnu Vishal", budget: 19000000, grossEarnings: 190000000 }, { name: "Amala Paul", budget: 14000000, grossEarnings: 140000000 }] },
  { id: 30, title: "The Godfather", genre: "Crime", rating: 9.1, imageUrl: "https://picsum.photos/id/1054/200/300", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", actorImageUrl: "https://picsum.photos/id/707/50/50", actors: [{ name: "Marlon Brando", budget: 21000000, grossEarnings: 210000000 }, { name: "Al Pacino", budget: 16000000, grossEarnings: 160000000 }] },
  { id: 31, title: "Pather Panchali", genre: "Drama", rating: 8.3, imageUrl: "https://picsum.photos/id/1055/200/300", description: "Impoverished village life in rural Bengal through the eyes of a young boy, Apu, and his family.", actorImageUrl: "https://picsum.photos/id/708/50/50", actors: [{ name: "Kanu Bannerjee", budget: 17000000, grossEarnings: 170000000 }, { name: "Karuna Bannerjee", budget: 12000000, grossEarnings: 120000000 }] }
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");
  const [reviewText, setReviewText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Filter movies based on genre
  const filteredMovies = filterGenre
    ? movies.filter((movie) => movie.genre.toLowerCase().includes(filterGenre.toLowerCase()))
    : movies;

  // Sort movies based on selected criteria
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return 0;
    }
  });

  // Genres array to reduce duplicate code in JSX
  const genres = ["All", ...Array.from(new Set(movies.map((movie) => movie.genre)))];

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarizeReview({ reviewText: reviewText });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to summarize review:", error);
      setSummary("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDialog = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">CineReview Hub</h1>

      {/* Filtering and Sorting Section */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <Input
          type="text"
          placeholder="Filter by genre"
          className="w-full md:w-64"
          onChange={(e) => setFilterGenre(e.target.value)}
        />

        <Select onValueChange={setSortBy} defaultValue={sortBy}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movie Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
        {sortedMovies.map((movie) => (
          <Card key={movie.id} className="transition-transform hover:scale-105 cursor-pointer" onClick={() => handleMovieClick(movie)}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <img src={movie.imageUrl} alt={movie.title} className="rounded-md mb-2 w-full h-48 object-cover" />
              <CardDescription className="text-sm text-muted-foreground">{movie.description}</CardDescription>
              <img src={movie.actorImageUrl} alt="Actor" className="rounded-full mt-2 w-16 h-16 object-cover" />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-accent font-semibold">
                Rating: {movie.rating} <Star className="inline-block h-4 w-4 mb-0.5" />
              </span>
              <span className="text-sm text-gray-500">Genre: {movie.genre}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* AI Review Summarizer Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-primary">AI Review Summarizer</h2>
        <Textarea
          placeholder="Enter review text to summarize"
          className="w-full mb-2"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <Button onClick={handleSummarize} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize Review"}
        </Button>
        {summary && (
          <div className="mt-4 p-4 rounded-md bg-secondary">
            <h3 className="font-semibold">Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
      <ScrollArea className="mt-4">
        {genres.map((genre) => (
          <Button key={genre} variant="outline" className="mr-2 mb-2">
            {genre}
          </Button>
        ))}
      </ScrollArea>

      {/* Movie Details Dialog */}
      <Dialog open={selectedMovie !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMovie?.title}</DialogTitle>
            <DialogDescription>
              {selectedMovie?.actors.map((actor, index) => (
                <div key={index}>
                  <p>Actor Name: {actor.name}</p>
                  <p>Budget: {actor.budget}</p>
                  <p>Gross Earnings: {actor.grossEarnings}</p>
                </div>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

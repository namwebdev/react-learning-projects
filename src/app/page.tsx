import { redirect } from "next/navigation";

function HomePage() {
  redirect("/search?q=");
}

export default HomePage;

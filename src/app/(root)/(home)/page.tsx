import { Grid } from "@/components/Dashboard/Grid";
import { TopBar } from "@/components/Dashboard/TopBar";

export default function Home() {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">
      <TopBar />
      <Grid />
    </div>
  );
}
